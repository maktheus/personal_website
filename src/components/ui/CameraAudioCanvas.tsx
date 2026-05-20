"use client";

import { useEffect, useRef, useState } from "react";

// Adaptive config — mobile gets far fewer ops per second
const MOBILE = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const CFG = {
  fps:           MOBILE ? 15   : 24,    // animation rate
  videoInterval: MOBILE ? 400  : 160,   // ms between video pixel samples
  step:          MOBILE ? 40   : 28,    // px grid spacing (fewer = more particles)
  camW:          MOBILE ? 160  : 320,
  camH:          MOBILE ? 120  : 240,
};

// Worker: owns OffscreenCanvas + particle cache
// - 'videoFrame' → expensive getImageData, rebuilds particle list (low freq)
// - 'audioTick'  → cheap re-render using cached particles (animation freq)
const WORKER_SRC = `
let canvas, ctx;
const offCanvas = new OffscreenCanvas(1, 1);
const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
let W = 0, H = 0, STEP = 28;

// Flat typed array: [x0, y0, b0, x1, y1, b1, ...]
let particles = new Float32Array(0);
let particleCount = 0;

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
    STEP = data.step;
    applyDpr(data.W, data.H, data.dpr);
  } else if (data.type === 'resize') {
    if (canvas) { STEP = data.step; applyDpr(data.W, data.H, data.dpr); }
  } else if (data.type === 'videoFrame') {
    processVideo(data.bitmap);
    data.bitmap.close();
  } else if (data.type === 'audioTick') {
    render(data.audioVolume, data.time);
  }
};

function processVideo(bitmap) {
  if (!W || !H) return;
  const cols = Math.floor(W / STEP);
  const rows = Math.floor(H / STEP);
  offCanvas.width = cols;
  offCanvas.height = rows;
  offCtx.save();
  offCtx.scale(-1, 1);
  offCtx.drawImage(bitmap, -cols, 0, cols, rows);
  offCtx.restore();
  const px = offCtx.getImageData(0, 0, cols, rows).data;

  // Reuse buffer if big enough
  const maxParticles = cols * rows;
  if (particles.length < maxParticles * 3) particles = new Float32Array(maxParticles * 3);
  particleCount = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const b = (px[i] + px[i + 1] + px[i + 2]) / 765;
      if (b > 0.12) {
        const j = particleCount * 3;
        particles[j] = x;
        particles[j + 1] = y;
        particles[j + 2] = b;
        particleCount++;
      }
    }
  }
}

function render(audioVolume, time) {
  if (!ctx || !W || !H || !particleCount) return;
  ctx.clearRect(0, 0, W, H);

  // No shadowBlur — too expensive on mobile GPU
  // Fake depth via two-layer draw: faint halo + bright core
  const scroll = (time * 10) % H;

  for (let i = 0; i < particleCount; i++) {
    const j = i * 3;
    const x = particles[j], y = particles[j + 1], b = particles[j + 2];
    const waveY = Math.sin(x * 0.1 + time) * (audioVolume * 30);
    const ry = (y * STEP + waveY - scroll + H) % H;
    const size = b * 4 + audioVolume * 10 * b;
    const alpha = Math.min(1, b * 0.9 + audioVolume * 0.5);

    // Halo (large, faint)
    ctx.beginPath();
    ctx.roundRect(x * STEP + STEP * 0.5 - size * 1.6, ry + STEP * 0.5 - size * 2, size * 3.2, size * 4, size);
    ctx.fillStyle = 'rgba(229,178,26,' + (alpha * 0.18) + ')';
    ctx.fill();

    // Core (sharp)
    ctx.beginPath();
    ctx.roundRect(x * STEP + STEP * 0.5 - size, ry + STEP * 0.5 - size * 1.5, size * 2, size * 3, size * 0.5);
    ctx.fillStyle = 'rgba(229,178,26,' + alpha + ')';
    ctx.fill();
  }
}
`;

export default function CameraAudioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const mobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const cfg = {
      fps:           mobile ? 15   : 24,
      videoInterval: mobile ? 400  : 160,
      step:          mobile ? 40   : 28,
      camW:          mobile ? 160  : 320,
      camH:          mobile ? 120  : 240,
    };
    const FRAME_MIN = 1000 / cfg.fps;

    let stream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let video: HTMLVideoElement | null = null;
    let worker: Worker | null = null;
    let workerUrl: string | null = null;
    let dataArray: Uint8Array<ArrayBuffer> | null = null;
    let rafId = 0;
    let lastFrameTime = 0;
    let lastVideoTime = -9999;
    let time = 0;
    let videoInFlight = false;
    let workerReady = false;
    let ro: ResizeObserver | null = null;

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(loop);
      }
    };

    function maybeCapture(ts: number) {
      if (videoInFlight || !workerReady || !video || video.readyState < 2) return;
      if (ts - lastVideoTime < cfg.videoInterval) return;
      lastVideoTime = ts;
      videoInFlight = true;
      createImageBitmap(video)
        .then((bitmap) => {
          worker?.postMessage({ type: "videoFrame", bitmap }, [bitmap]);
          videoInFlight = false;
        })
        .catch(() => { videoInFlight = false; });
    }

    function loop(ts: number) {
      rafId = requestAnimationFrame(loop);
      if (ts - lastFrameTime < FRAME_MIN) return;
      lastFrameTime = ts;
      if (!analyser || !dataArray || !workerReady) return;

      maybeCapture(ts);

      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const audioVolume = sum / dataArray.length / 255;
      time += 0.05 + audioVolume * 0.1;

      worker?.postMessage({ type: "audioTick", audioVolume, time });
    }

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width:     { ideal: cfg.camW },
            height:    { ideal: cfg.camH },
            frameRate: { max: cfg.fps },
          },
          audio: true,
        });
        setHasPermission(true);

        video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        await video.play();

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtx();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.7;
        audioCtx.createMediaStreamSource(stream).connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

        const canvas = canvasRef.current;
        if (!canvas) return;

        let offscreen: OffscreenCanvas;
        try { offscreen = canvas.transferControlToOffscreen(); }
        catch { return; } // strict-mode double-invoke guard

        const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
        workerUrl = URL.createObjectURL(blob);
        worker = new Worker(workerUrl);
        worker.postMessage(
          { type: "init", canvas: offscreen, W: canvas.offsetWidth, H: canvas.offsetHeight, dpr: window.devicePixelRatio, step: cfg.step },
          [offscreen]
        );
        workerReady = true;

        ro = new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          worker?.postMessage({ type: "resize", W: width, H: height, dpr: window.devicePixelRatio, step: cfg.step });
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
