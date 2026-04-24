"use client";

import { useEffect, useRef, useState } from "react";

const TARGET_FPS = 24;
const FRAME_MIN = 1000 / TARGET_FPS;

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

// Inline Web Worker — pixel math runs in C/WASM; canvas draw stays JS
const WORKER_SRC = `
const WASM_B64 = "${WASM_B64}";
const STEP = 24;

let canvas, ctx;
const offCanvas = new OffscreenCanvas(1, 1);
const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
let W = 0, H = 0;

// WASM handles
let wasm = null;
let pxPtr = 0, outPtr = 0;
let wasmMem = null;

// Decode base64 → ArrayBuffer
function b64ToBuffer(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

// Boot WASM module (synchronous instantiation from ArrayBuffer)
async function initWasm() {
  const buf = b64ToBuffer(WASM_B64);
  const { instance } = await WebAssembly.instantiate(buf, {});
  wasm     = instance.exports;
  wasmMem  = new DataView(wasm.memory.buffer);
  pxPtr    = wasm.get_px_ptr();
  outPtr   = wasm.get_out_ptr();
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
    applyDpr(data.W, data.H, data.dpr);
    await initWasm();
  } else if (data.type === 'resize') {
    if (canvas) applyDpr(data.W, data.H, data.dpr);
  } else if (data.type === 'frame') {
    renderFrame(data.imageBitmap, data.audioVolume, data.time);
    data.imageBitmap.close();
  }
};

function renderFrame(bitmap, audioVolume, time) {
  if (!ctx || !W || !H || !wasm) return;
  const cols = Math.floor(W / STEP);
  const rows = Math.floor(H / STEP);
  const cells = cols * rows;

  // Downsample video frame to grid resolution via OffscreenCanvas
  offCanvas.width  = cols;
  offCanvas.height = rows;
  offCtx.save();
  offCtx.scale(-1, 1);
  offCtx.drawImage(bitmap, -cols, 0, cols, rows);
  offCtx.restore();
  const rawPx = offCtx.getImageData(0, 0, cols, rows).data; // Uint8ClampedArray

  // Copy pixel data into WASM linear memory
  new Uint8Array(wasm.memory.buffer, pxPtr, cells * 4).set(rawPx.subarray(0, cells * 4));

  // Run the tight C loop — brightness, wave, size computation
  wasm.process_cells(cols, rows, audioVolume, time, H, STEP);

  // Read output float array from WASM memory
  const out = new Float32Array(wasm.memory.buffer, outPtr, cells * 3);

  // Canvas 2D rendering — draw calls remain in JS
  ctx.clearRect(0, 0, W, H);
  ctx.shadowBlur  = 12;
  ctx.shadowColor = 'rgba(229,178,26,' + (audioVolume * 0.8 + 0.2) + ')';

  for (let cell = 0; cell < cells; cell++) {
    const bNorm = out[cell * 3];
    if (bNorm <= 0.1) continue;
    const x    = cell % cols;
    const ry   = out[cell * 3 + 1];
    const size = out[cell * 3 + 2];
    ctx.beginPath();
    ctx.roundRect(x * STEP + STEP * 0.5 - size, ry + STEP * 0.5 - size * 1.5, size * 2, size * 3, size * 0.5);
    ctx.fillStyle = 'rgba(229,178,26,' + Math.min(1, bNorm * 0.9 + audioVolume * 0.5) + ')';
    ctx.fill();
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
          return;
        }

        const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
        workerUrl = URL.createObjectURL(blob);
        worker = new Worker(workerUrl);
        worker.postMessage(
          { type: "init", canvas: offscreen, W: canvas.offsetWidth, H: canvas.offsetHeight, dpr: window.devicePixelRatio },
          [offscreen!]
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
