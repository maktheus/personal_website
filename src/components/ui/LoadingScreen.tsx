"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Mini-particles for the loading screen canvas
   (lighter than the main Boids — only 28 particles, no flocking)
────────────────────────────────────────────────────────────── */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const particles: P[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1 + Math.random() * 1.5,
      a: 0.1 + Math.random() * 0.5,
    }));

    // draw lines between close particles
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(229,178,26,${(1 - d / 120) * 0.25})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(229,178,26,${p.a})`;
        ctx!.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, canvasRef]);
}

/* ─────────────────────────────────────────────────────────────
   Animated counter 000 → 100
────────────────────────────────────────────────────────────── */
function useCounter(active: boolean, duration: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration]);
  return count;
}

/* ─────────────────────────────────────────────────────────────
   Main component
────────────────────────────────────────────────────────────── */
const TOTAL_MS = 2200; // total loading duration

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const count = useCounter(true, TOTAL_MS - 400);

  useParticles(canvasRef, phase === "loading");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "done") {
      // give exit animation time then unmount
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  const exiting = phase === "done";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#0b0d0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.04)" : "scale(1)",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Centre content */}
      <div style={{ position: "relative", textAlign: "center", userSelect: "none" }}>

        {/* Monogram */}
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 800,
            fontSize: "clamp(3rem, 12vw, 7rem)",
            letterSpacing: "-0.05em",
            color: "#e1e6e1",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          M<span style={{ color: "#e5b21a" }}>S</span>U
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(229,178,26,0.6)",
            marginBottom: "2.5rem",
          }}
        >
          Software Engineer
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: "200px",
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "1px",
            overflow: "hidden",
            margin: "0 auto 1rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${count}%`,
              background: "linear-gradient(90deg, #4c3900, #e5b21a)",
              transition: "width 80ms linear",
            }}
          />
        </div>

        {/* Counter */}
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: "rgba(229,178,26,0.5)",
          }}
        >
          {String(count).padStart(3, "0")}
        </p>
      </div>

      {/* Corner grid lines — decorative */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 20,
            height: 20,
            border: "1px solid rgba(229,178,26,0.2)",
            borderRadius: 2,
          }}
        />
      ))}

      {/* Location bottom */}
      <p
        style={{
          position: "absolute",
          bottom: 28,
          right: 32,
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: "rgba(229,178,26,0.3)",
          textTransform: "uppercase",
        }}
      >
        Manaus · AM · Brasil
      </p>
    </div>
  );
}
