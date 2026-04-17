"use client";

import { useEffect, useRef } from "react";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
}

// Reduced count + spatial grid = much lighter
const BOID_COUNT = 48;
const HISTORY_LEN = 6;
const MAX_SPEED = 2.0;
const MIN_SPEED = 0.7;
const PERCEPTION_RADIUS = 90;
const AVOID_RADIUS = 26;
const MOUSE_RADIUS = 110;
const MOUSE_STRENGTH = 0.55;
const CELL_SIZE = PERCEPTION_RADIUS;

const W_ALIGN = 0.85;
const W_COHESION = 0.55;
const W_SEPARATION = 1.3;

function clamp(vx: number, vy: number): [number, number] {
  const s = Math.hypot(vx, vy);
  if (s === 0) return [MIN_SPEED, 0];
  if (s > MAX_SPEED) return [(vx / s) * MAX_SPEED, (vy / s) * MAX_SPEED];
  if (s < MIN_SPEED) return [(vx / s) * MIN_SPEED, (vy / s) * MIN_SPEED];
  return [vx, vy];
}

// Spatial hash grid for O(n) neighbor lookups instead of O(n²)
function buildGrid(boids: Boid[], W: number, H: number) {
  const cols = Math.ceil(W / CELL_SIZE);
  const rows = Math.ceil(H / CELL_SIZE);
  const grid = new Map<number, number[]>();
  for (let i = 0; i < boids.length; i++) {
    const cx = Math.floor(boids[i].x / CELL_SIZE);
    const cy = Math.floor(boids[i].y / CELL_SIZE);
    const key = cy * cols + cx;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(i);
  }
  return { grid, cols, rows };
}

function getNeighborCells(cx: number, cy: number, cols: number, rows: number) {
  const cells: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        cells.push(ny * cols + nx);
      }
    }
  }
  return cells;
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

    // Cap DPR at 1.5 for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    boidsRef.current = Array.from({ length: BOID_COUNT }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * MAX_SPEED * 2,
      vy: (Math.random() - 0.5) * MAX_SPEED * 2,
      history: [],
    }));

    function update() {
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const boids = boidsRef.current;
      const { grid, cols, rows } = buildGrid(boids, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        const cx = Math.floor(b.x / CELL_SIZE);
        const cy = Math.floor(b.y / CELL_SIZE);
        const neighborCells = getNeighborCells(cx, cy, cols, rows);

        let alignX = 0, alignY = 0, cohX = 0, cohY = 0, sepX = 0, sepY = 0, count = 0;

        for (const cell of neighborCells) {
          const indices = grid.get(cell);
          if (!indices) continue;
          for (const j of indices) {
            if (i === j) continue;
            const o = boids[j];
            const dx = o.x - b.x;
            const dy = o.y - b.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < PERCEPTION_RADIUS * PERCEPTION_RADIUS) {
              alignX += o.vx; alignY += o.vy;
              cohX += o.x; cohY += o.y;
              count++;
              if (dist2 < AVOID_RADIUS * AVOID_RADIUS && dist2 > 0) {
                const dist = Math.sqrt(dist2);
                sepX -= dx / dist;
                sepY -= dy / dist;
              }
            }
          }
        }

        if (count > 0) {
          b.vx += (alignX / count) * W_ALIGN * 0.02;
          b.vy += (alignY / count) * W_ALIGN * 0.02;
          b.vx += ((cohX / count - b.x) * W_COHESION) * 0.0005;
          b.vy += ((cohY / count - b.y) * W_COHESION) * 0.0005;
          b.vx += sepX * W_SEPARATION * 0.05;
          b.vy += sepY * W_SEPARATION * 0.05;
        }

        // Mouse flee
        const mdx = b.x - mx, mdy = b.y - my;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_RADIUS * MOUSE_RADIUS && md2 > 0) {
          const md = Math.sqrt(md2);
          const force = (1 - md / MOUSE_RADIUS) * MOUSE_STRENGTH;
          b.vx += (mdx / md) * force;
          b.vy += (mdy / md) * force;
        }

        [b.vx, b.vy] = clamp(b.vx, b.vy);

        b.history.push({ x: b.x, y: b.y });
        if (b.history.length > HISTORY_LEN) b.history.shift();

        b.x = (b.x + b.vx + W) % W;
        b.y = (b.y + b.vy + H) % H;
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      for (const b of boidsRef.current) {
        const speed = Math.hypot(b.vx, b.vy);
        const t = speed / MAX_SPEED;

        if (b.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.history[0].x, b.history[0].y);
          for (let k = 1; k < b.history.length; k++) {
            ctx.lineTo(b.history[k].x, b.history[k].y);
          }
          ctx.strokeStyle = `rgba(229,178,26,${0.05 + t * 0.1})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        const angle = Math.atan2(b.vy, b.vx);
        const size = 3.5 + t * 2;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size * 1.8, 0);
        ctx.lineTo(-size, size * 0.6);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size, -size * 0.6);
        ctx.closePath();

        const grad = ctx.createLinearGradient(-size, 0, size * 1.8, 0);
        grad.addColorStop(0, `rgba(76,57,0,${0.35 + t * 0.3})`);
        grad.addColorStop(1, `rgba(229,178,26,${0.65 + t * 0.35})`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    }

    let lastTime = 0;
    const TARGET_FPS = 50; // cap at 50fps to reduce CPU
    const FRAME_MIN = 1000 / TARGET_FPS;

    function loop(ts: number) {
      rafRef.current = requestAnimationFrame(loop);
      if (ts - lastTime < FRAME_MIN) return;
      lastTime = ts;
      update();
      draw();
    }

    rafRef.current = requestAnimationFrame(loop);

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() { mouseRef.current = { x: -9999, y: -9999 }; }

    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
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
      aria-hidden="true"
    />
  );
}
