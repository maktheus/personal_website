"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { scrollTo } from "@/lib/lenis";
import { personal } from "@/lib/data";

const BoidsCanvas = dynamic(() => import("@/components/ui/BoidsCanvas"), { ssr: false });

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>(".hero-line");
    const meta  = el.querySelectorAll<HTMLElement>(".hero-meta");
    lines.forEach((l, i) => {
      setTimeout(() => l.classList.add("revealed"), 120 + i * 110);
    });
    meta.forEach((m, i) => {
      setTimeout(() => m.classList.add("revealed"), 500 + i * 80);
    });
  }, []);

  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" />

      {/* Boids — right half only */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 top-0 w-full h-full md:w-3/5">
          <BoidsCanvas />
        </div>
        {/* gradient mask so boids fade behind text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--bg) 30%, transparent 70%), linear-gradient(180deg, var(--bg) 0%, transparent 12%, transparent 88%, var(--bg) 100%)",
          }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="container relative z-10" ref={wrapRef}>

        {/* Status chip */}
        <div className="hero-meta clip-reveal flex items-center gap-2 mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent)" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
          </span>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            Available · Remote / Relocation
          </span>
        </div>

        {/* Name — massive fluid type */}
        <h1
          className="font-bold leading-none mb-8"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9.5rem)", letterSpacing: "-0.05em" }}
        >
          {["Matheus", "Serrão", "Uchôa"].map((word, i) => (
            <span key={word} className="hero-line clip-reveal block overflow-hidden">
              <span className="block" style={{ color: i === 1 ? "var(--accent)" : "inherit" }}>
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Horizontal rule */}
        <div className="hero-meta clip-reveal gradient-line mb-8" />

        {/* Role + subtitle row */}
        <div className="hero-meta clip-reveal flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-8 mb-8">
          <p
            className="text-xl sm:text-2xl font-semibold"
            style={{ letterSpacing: "-0.02em" }}
          >
            {personal.title}
          </p>
          <p
            className="font-mono text-sm"
            style={{ color: "var(--accent-mid)" }}
          >
            {personal.subtitle}
          </p>
        </div>

        {/* Location */}
        <div
          className="hero-meta clip-reveal flex items-center gap-1.5 mb-10 text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {personal.location}
        </div>

        {/* CTAs */}
        <div className="hero-meta clip-reveal flex flex-wrap items-center gap-4 mb-10">
          <button
            onClick={() => scrollTo("#projects")}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ background: "var(--accent)", color: "#0d0d0d" }}
          >
            View Work
            <svg
              className="transition-transform group-hover:translate-x-1"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <a
            href="/assets/cv-matheus.pdf"
            download
            className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
          >
            Download CV
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>

          {/* Social icons */}
          <div className="flex items-center gap-4 ml-2">
            {[
              {
                href: personal.github, label: "GitHub",
                icon: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />,
                fill: true,
              },
              {
                href: personal.linkedin, label: "LinkedIn",
                icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
                fill: true,
              },
            ].map(({ href, label, icon, fill }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors hover:text-[var(--accent)]"
                style={{ color: "var(--text-muted)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="2">
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
