"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraAudioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [denied, setDenied] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioSrc: MediaStreamAudioSourceNode | null = null;

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });
        
        setHasPermission(true);

        // Setup Video
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true; // Important so it doesn't feedback
        video.playsInline = true;
        await video.play();
        videoRef.current = video;

        // Setup Audio
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        audioSrc = audioCtx.createMediaStreamSource(stream);
        audioSrc.connect(analyser);

        startRenderLoop();
      } catch (err) {
        console.error("Camera/Audio permission denied", err);
        setDenied(true);
      }
    }

    init();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  function startRenderLoop() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Offscreen canvas for video processing
    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    function loop() {
      if (!videoRef.current || !analyserRef.current || !canvas || !ctx || !offCtx) return;

      const video = videoRef.current;
      const analyser = analyserRef.current;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      // Update audio data
      analyser.getByteFrequencyData(dataArray);
      let audioVolume = 0;
      for (let i = 0; i < dataArray.length; i++) {
        audioVolume += dataArray[i];
      }
      audioVolume = (audioVolume / dataArray.length) / 255.0; // 0.0 to 1.0

      ctx.clearRect(0, 0, W, H);

      // We render a grid of chiral dots that react to brightness and audio
      const step = 20;

      // Draw video to offscreen canvas
      offCanvas.width = Math.floor(W / step);
      offCanvas.height = Math.floor(H / step);
      
      // Mirror the video so it acts like a mirror
      offCtx.save();
      offCtx.scale(-1, 1);
      offCtx.drawImage(video, -offCanvas.width, 0, offCanvas.width, offCanvas.height);
      offCtx.restore();

      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;

      time += 0.05 + (audioVolume * 0.1);

      for (let y = 0; y < offCanvas.height; y++) {
        for (let x = 0; x < offCanvas.width; x++) {
          const i = (y * offCanvas.width + x) * 4;
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          
          // Calculate brightness
          const brightness = (r + g + b) / 3;
          const bNorm = brightness / 255; 
          
          if (bNorm > 0.1) {
            const posX = x * step;
            const posY = y * step;
            
            // Death stranding displacement: floating upwards with audio
            const waveY = Math.sin(x * 0.1 + time) * (audioVolume * 30);
            
            const renderX = posX;
            const renderY = posY + waveY;

            // Chiral Gold fading to Dark base
            ctx.beginPath();
            
            // The louder it is, the larger the dots. Brighter pixels are bigger.
            const baseRadius = bNorm * 4;
            const audioRadius = audioVolume * 10 * bNorm;
            ctx.arc(renderX + step/2, renderY + step/2, baseRadius + audioRadius, 0, Math.PI * 2);
            
            ctx.fillStyle = `rgba(229, 178, 26, ${(bNorm * 0.8) + (audioVolume * 0.5)})`;
            ctx.fill();

            // Connect neighboring strong points to form "Odradek scanning lines"
            if (bNorm > 0.6 && audioVolume > 0.4 && Math.random() > 0.95) {
              ctx.beginPath();
              ctx.moveTo(renderX + step/2, renderY + step/2);
              ctx.lineTo(renderX + step/2 + (Math.random() - 0.5) * 100, renderY + step/2 + (Math.random() - 0.5) * 100);
              ctx.strokeStyle = `rgba(229, 178, 26, ${audioVolume * 0.4})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }

  // Fallback if denied could be simple text or re-triggering Boids
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
