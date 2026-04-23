"use client";

import { useEffect, useRef, useState } from "react";

const TARGET_FPS = 24;
const FRAME_MIN = 1000 / TARGET_FPS;

// Inline Web Worker — runs pixel processing + canvas rendering off the main thread
const WORKER_SRC = `
let canvas, ctx;
const offCanvas = new OffscreenCanvas(1, 1);
const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
let W = 0, H = 0;
const STEP = 24;

function applyDpr(w, h, dpr) {
  const d = Math.min(dpr, 1.5);
  canvas.width = Math.round(w * d);
  canvas.height = Math.round(h * d);
  ctx = canvas.getContext('2d');
  ctx.scale(d, d);
  W = w; H = h;
}

self.onmessage = function({ data }) {
  if (data.type === 'init') {
    canvas = data.canvas;
    applyDpr(data.W, data.H, data.dpr);
  } else if (data.type === 'resize') {
    if (canvas) applyDpr(data.W, data.H, data.dpr);
  } else if (data.type === 'frame') {
    renderFrame(data.imageBitmap, data.audioVolume, data.time);
    data.imageBitmap.close();
  }
};

function renderFrame(bitmap, audioVolume, time) {
  if (!ctx || !W || !H) return;
  const cols = Math.floor(W / STEP);
  const rows = Math.floor(H / STEP);

  offCanvas.width = cols;
  offCanvas.height = rows;
  offCtx.save();
  offCtx.scale(-1, 1);
  offCtx.drawImage(bitmap, -cols, 0, cols, rows);
  offCtx.restore();
  const px = offCtx.getImageData(0, 0, cols, rows).data;

  ctx.clearRect(0, 0, W, H);
  ctx.shadowBlur = 12;
  ctx.shadowColor = 'rgba(229,178,26,' + (audioVolume * 0.8 + 0.2) + ')';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const bNorm = (px[i] + px[i + 1] + px[i + 2]) / 765;
      if (bNorm <= 0.1) continue;
      const waveY = Math.sin(x * 0.1 + time) * (audioVolume * 30);
      const ry = (y * STEP + waveY - (time * 10) % H + H) % H;
      const size = bNorm * 4 + audioVolume * 10 * bNorm;
      ctx.beginPath();
      ctx.roundRect(x * STEP + STEP * 0.5 - size, ry + STEP * 0.5 - size * 1.5, size * 2, size * 3, size * 0.5);
      ctx.fillStyle = 'rgba(229,178,26,' + Math.min(1, bNorm * 0.9 + audioVolume * 0.5) + ')';
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;
}
`;

export default function CameraAudioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let video: HTMLVideoElement | null = null;
    let worker: Worker | null = null;
    let workerUrl: string | null = null;
    let dataArray: Uint8Array<ArrayBuffer> | null = null;
    let rafId = 0;
    let lastFrameTime = 0;
    let time = 0;
    let frameInFlight = false;
    let workerReady = false;
    let ro: ResizeObserver | null = null;
    let offscreen: OffscreenCanvas | null = null;

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(loop);
      }
    };

    function loop(ts: number) {
      rafId = requestAnimationFrame(loop);
      if (ts - lastFrameTime < FRAME_MIN) return;
      lastFrameTime = ts;
      if (!video || !analyser || !dataArray || !workerReady || frameInFlight) return;
      if (video.readyState < 2) return;

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const audioVolume = sum / dataArray.length / 255;
      time += 0.05 + audioVolume * 0.1;

      frameInFlight = true;
      createImageBitmap(video)
        .then((bitmap) => {
          worker?.postMessage({ type: "frame", imageBitmap: bitmap, audioVolume, time }, [bitmap]);
          frameInFlight = false;
        })
        .catch(() => { frameInFlight = false; });
    }

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { max: 24 } },
          audio: true,
        });
        setHasPermission(true);

        video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        await video.play();

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.7;
        const src = audioCtx.createMediaStreamSource(stream);
        src.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
          offscreen = canvas.transferControlToOffscreen();
        } catch {
          // already transferred in dev strict-mode double-invoke
          return;
        }

        const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
        workerUrl = URL.createObjectURL(blob);
        worker = new Worker(workerUrl);
        worker.postMessage(
          { type: "init", canvas: offscreen, W: canvas.offsetWidth, H: canvas.offsetHeight, dpr: window.devicePixelRatio },
          [offscreen]
        );
        workerReady = true;

        ro = new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          worker?.postMessage({ type: "resize", W: width, H: height, dpr: window.devicePixelRatio });
        });
        ro.observe(canvas);

        document.addEventListener("visibilitychange", onVisibilityChange);
        rafId = requestAnimationFrame(loop);
      } catch {
        setDenied(true);
      }
    }

    init();

    return () => {
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
      audioCtx?.close();
      worker?.terminate();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (workerUrl) URL.revokeObjectURL(workerUrl);
    };
  }, []);

  if (denied) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <p className="font-mono text-sm tracking-widest text-[#e5b21a]">SENSOR LINK OFFLINE</p>
      </div>
    );
  }

  return (
    <>
      {!hasPermission && !denied && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <p className="font-mono text-xs tracking-widest text-[#727f72] animate-pulse">ESTABLISHING CHIRAL CONNECTION...</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ pointerEvents: "auto", mixBlendMode: "screen" }}
        aria-hidden="true"
      />
    </>
  );
}
