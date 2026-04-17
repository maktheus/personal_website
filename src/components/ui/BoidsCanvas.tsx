"use client";

import { useEffect, useRef } from "react";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
}

const BOID_COUNT = 80;
const HISTORY_LEN = 8;
const MAX_SPEED = 2.2;
const MIN_SPEED = 0.8;
const PERCEPTION_RADIUS = 80;
const AVOID_RADIUS = 28;
const MOUSE_RADIUS = 120;
const MOUSE_STRENGTH = 0.6;

// Steering weights
const W_ALIGN = 0.9;
const W_COHESION = 0.6;
const W_SEPARATION = 1.4;

function clampSpeed(vx: number, vy: number): [number, number] {
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed === 0) return [0, 0];
  if (speed > MAX_SPEED) {
    return [(vx / speed) * MAX_SPEED, (vy / speed) * MAX_SPEED];
  }
  if (speed < MIN_SPEED) {
    return [(vx / speed) * MIN_SPEED, (vy / speed) * MIN_SPEED];
  }
  return [vx, vy];
}

export default function BoidsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const boidsRef = useRef<Boid[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();
    window.addEventListener("resize", resize);

    // Init boids
    boidsRef.current = Array.from({ length: BOID_COUNT }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * MAX_SPEED * 2,
      vy: (Math.random() - 0.5) * MAX_SPEED * 2,
      history: [],
    }));

    function update() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const boids = boidsRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];

        let alignX = 0, alignY = 0;
        let cohX = 0, cohY = 0;
        let sepX = 0, sepY = 0;
        let count = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const o = boids[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < PERCEPTION_RADIUS) {
            alignX += o.vx;
            alignY += o.vy;
            cohX += o.x;
            cohY += o.y;
            count++;

            if (dist < AVOID_RADIUS && dist > 0) {
              sepX -= dx / dist;
              sepY -= dy / dist;
            }
          }
        }

        if (count > 0) {
          // Alignment
          b.vx += (alignX / count) * W_ALIGN * 0.02;
          b.vy += (alignY / count) * W_ALIGN * 0.02;
          // Cohesion
          b.vx += ((cohX / count - b.x) * W_COHESION) * 0.0005;
          b.vy += ((cohY / count - b.y) * W_COHESION) * 0.0005;
          // Separation
          b.vx += sepX * W_SEPARATION * 0.05;
          b.vy += sepY * W_SEPARATION * 0.05;
        }

        // Mouse interaction — flee
        const mdx = b.x - mx;
        const mdy = b.y - my;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_RADIUS && mdist > 0) {
          const force = (1 - mdist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          b.vx += (mdx / mdist) * force;
          b.vy += (mdy / mdist) * force;
        }

        [b.vx, b.vy] = clampSpeed(b.vx, b.vy);

        // Save history
        b.history.push({ x: b.x, y: b.y });
        if (b.history.length > HISTORY_LEN) b.history.shift();

        b.x += b.vx;
        b.y += b.vy;

        // Wrap edges
        if (b.x < 0) b.x += W;
        if (b.x > W) b.x -= W;
        if (b.y < 0) b.y += H;
        if (b.y > H) b.y -= H;
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const boids = boidsRef.current;

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const t = speed / MAX_SPEED; // 0..1

        // Tail
        if (b.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.history[0].x, b.history[0].y);
          for (let k = 1; k < b.history.length; k++) {
            ctx.lineTo(b.history[k].x, b.history[k].y);
          }
          ctx.strokeStyle = `rgba(234, 242, 5, ${0.06 + t * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Body — triangle pointing in direction of movement
        const angle = Math.atan2(b.vy, b.vx);
        const size = 4 + t * 2;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size * 1.8, 0);
        ctx.lineTo(-size, size * 0.6);
        ctx.lineTo(-size * 0.5, 0);
        ctx.lineTo(-size, -size * 0.6);
        ctx.closePath();

        // Gradient fill: accent yellow → deep gold
        const grad = ctx.createLinearGradient(-size, 0, size * 1.8, 0);
        grad.addColorStop(0, `rgba(89, 76, 12, ${0.4 + t * 0.3})`);
        grad.addColorStop(1, `rgba(234, 242, 5, ${0.7 + t * 0.3})`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    }

    function loop() {
      update();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}
