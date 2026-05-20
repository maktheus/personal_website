"use client";

import { useEffect, useRef, useState } from "react";

/*
 * process_pixels.wasm — compiled from src/wasm/process_pixels.c using:
 *   clang --target=wasm32 -nostdlib -Wl,--no-entry
 *         -Wl,--export=process_cells -Wl,--export=get_px_ptr -Wl,--export=get_out_ptr
 *         -O3 -o process_pixels.wasm process_pixels.c
 *
 * Embeds as base64 so the inline Worker blob can load it without fetch/CORS.
 * Exports: get_px_ptr() → u8*, get_out_ptr() → f32*, process_cells(cols,rows,vol,time,H,step)
 */
const WASM_B64 =
  "AGFzbQEAAAABDgJgAAF/YAZ/f319fX8AAwQDAAABBAUBcAEBAQUDAQAGBggBfwFBgMwXCwc1BAZtZW1vcnkCAApnZXRfcHhfcHRyAAALZ2V0X291dF9wdHIAAQ1wcm9jZXNzX2NlbGxzAAIKjAQDCABBgIiAgAALCABBgPmEgAAL9wMGAn0BfwR9BX8BfQJ/AkACQCADQwAAIEGUIgYgBJUiB4tDAAAAT11FDQAgB6ghCAwBC0GAgICAeCEICwJAIAFBAUgNACAAQQFIDQAgBiAIsiAElJMhCSACQwAA8EGUIQogBbIhCyACQwAAIEGUIQwgAEECdCENIABBDGwhDkEAIQ9BgPmEgAAhEEGAiICAACERA0AgCyAPspQhEiARIQUgECEIQQAhEwNAIAggBS0AALMgBUEBai0AALOSIAVBAmotAACzkkMAQD9ElSICOAIAIAhBCGogAkMAAIBAlCAMIAKUkjgCAAJAAkAgE7JDzczMPZQgA5IiAkPbD8lAlSIHi0MAAABPXUUNACAHqCEUDAELQYCAgIB4IRQLAkACQCASIAogAiAUskPbD8lAlJMiAkPbD8lAkiACIAJDAAAAAF0bIgJD2w9JwJIgAiACQ9sPSUBeIhQbIgJDAACAQZRD2w9JQCACkyIHlCIGjCAGIBQbIAJDAACAwJQgB5RDYWRFQpKVlJIgCZMgBJIiAiAElSIHi0MAAABPXUUNACAHqCEUDAELQYCAgIB4IRQLIAhBBGogAiAUsiAElJM4AgAgBUEEaiEFIAhBDGohCCAAIBNBAWoiE0cNAAsgESANaiERIBAgDmohECAPQQFqIg8gAUcNAAsLCwBaBG5hbWUAFBNwcm9jZXNzX3BpeGVscy53YXNtASkDAApnZXRfcHhfcHRyAQtnZXRfb3V0X3B0cgINcHJvY2Vzc19jZWxscwcSAQAPX19zdGFja19wb2ludGVyADgJcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDFVidW50dSBjbGFuZxExOC4xLjMgKDF1YnVudHUxKQAsD3RhcmdldF9mZWF0dXJlcwIrD211dGFibGUtZ2xvYmFscysIc2lnbi1leHQ=";

// Worker:
// - 'videoFrame' → WASM pixel loop builds particle cache (low freq: 3-6 FPS)
// - 'audioTick'  → lightweight re-render from cache (animation freq: 15-24 FPS)
// No shadowBlur — replaced with cheap two-layer alpha halo (mobile GPU safe)
const WORKER_SRC = `
const WASM_B64 = "${WASM_B64}";
let STEP = 28;

let canvas, ctx;
const offCanvas = new OffscreenCanvas(1, 1);
const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
let W = 0, H = 0;

let wasm = null;
let pxPtr = 0, outPtr = 0;

// Flat particle cache [gridX, gridY, bNorm, ...] rebuilt only on videoFrame
let particles = new Float32Array(0);
let particleCount = 0;

function b64ToBuffer(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function initWasm() {
  const buf = b64ToBuffer(WASM_B64);
  const { instance } = await WebAssembly.instantiate(buf, {});
  wasm   = instance.exports;
  pxPtr  = wasm.get_px_ptr();
  outPtr = wasm.get_out_ptr();
}

function applyDpr(w, h, dpr) {
  const d = Math.min(dpr, 1.5);
  canvas.width  = Math.round(w * d);
  canvas.height = Math.round(h * d);
  ctx = canvas.getContext('2d');
  ctx.scale(d, d);
  W = w; H = h;
}

self.onmessage = async function({ data }) {
  if (data.type === 'init') {
    canvas = data.canvas;
    STEP = data.step;
    applyDpr(data.W, data.H, data.dpr);
    await initWasm();
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
  if (!wasm || !W || !H) return;
  const cols  = Math.floor(W / STEP);
  const rows  = Math.floor(H / STEP);
  const cells = cols * rows;

  offCanvas.width  = cols;
  offCanvas.height = rows;
  offCtx.save();
  offCtx.scale(-1, 1);
  offCtx.drawImage(bitmap, -cols, 0, cols, rows);
  offCtx.restore();
  const rawPx = offCtx.getImageData(0, 0, cols, rows).data;

  // WASM C loop: brightness threshold + per-cell math
  // vol=0, time=0 → only bNorm matters here; wave/float recomputed at render time
  new Uint8Array(wasm.memory.buffer, pxPtr, cells * 4).set(rawPx.subarray(0, cells * 4));
  wasm.process_cells(cols, rows, 0, 0, H, STEP);
  const out = new Float32Array(wasm.memory.buffer, outPtr, cells * 3);

  if (particles.length < cells * 3) particles = new Float32Array(cells * 3);
  particleCount = 0;
  for (let cell = 0; cell < cells; cell++) {
    const bNorm = out[cell * 3];
    if (bNorm <= 0.1) continue;
    const j = particleCount * 3;
    particles[j]     = cell % cols;
    particles[j + 1] = Math.floor(cell / cols);
    particles[j + 2] = bNorm;
    particleCount++;
  }
}

function render(audioVolume, time) {
  if (!ctx || !W || !H || !particleCount) return;
  ctx.clearRect(0, 0, W, H);
  const scroll = (time * 10) % H;

  for (let i = 0; i < particleCount; i++) {
    const j     = i * 3;
    const gx    = particles[j], gy = particles[j + 1], b = particles[j + 2];
    const waveY = Math.sin(gx * 0.1 + time) * (audioVolume * 30);
    const ry    = (gy * STEP + waveY - scroll + H) % H;
    const size  = b * 4 + audioVolume * 10 * b;
    const alpha = Math.min(1, b * 0.9 + audioVolume * 0.5);

    // Faint halo — replaces shadowBlur (no GPU blur pass)
    ctx.beginPath();
    ctx.roundRect(gx * STEP + STEP * 0.5 - size * 1.6, ry + STEP * 0.5 - size * 2, size * 3.2, size * 4, size);
    ctx.fillStyle = 'rgba(229,178,26,' + (alpha * 0.18) + ')';
    ctx.fill();

    // Bright core
    ctx.beginPath();
    ctx.roundRect(gx * STEP + STEP * 0.5 - size, ry + STEP * 0.5 - size * 1.5, size * 2, size * 3, size * 0.5);
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
      fps:           mobile ? 15  : 24,
      videoInterval: mobile ? 400 : 160,  // ms between getImageData+WASM calls
      step:          mobile ? 40  : 28,
      camW:          mobile ? 160 : 320,
      camH:          mobile ? 120 : 240,
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
        catch { return; }

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
