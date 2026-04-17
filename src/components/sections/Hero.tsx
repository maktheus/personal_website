"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { scrollTo } from "@/lib/lenis";
import { personal } from "@/lib/data";

const CameraAudioCanvas = dynamic(() => import("@/components/ui/CameraAudioCanvas"), {
  ssr: false,
});

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden hero-grid"
      style={{ minHeight: "100svh" }}
    >
      {/* Boids live in the bottom-right corner area */}
      <div
        className="absolute bottom-0 right-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <CameraAudioCanvas />
      </div>

      {/* Radial fade so boids don't cover text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 50%, var(--bg) 30%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="container relative z-10">
        <div ref={ref} className="fade-up max-w-3xl">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-8">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--accent)" }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>
              Available for opportunities · Remote / Relocation
            </span>
          </div>

          {/* Name */}
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4"
            style={{ letterSpacing: "-0.04em", lineHeight: "0.95" }}
          >
            {personal.name.split(" ").map((word, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  word
                ) : i === 1 ? (
                  <span style={{ color: "var(--accent)" }}>{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>

          {/* Title */}
          <p
            className="text-lg sm:text-xl font-medium mt-6 mb-2"
            style={{ color: "var(--text-muted)", letterSpacing: "-0.01em" }}
          >
            {personal.title}
          </p>
          <p
            className="font-mono text-sm"
            style={{ color: "var(--accent-mid)" }}
          >
            {personal.subtitle}
          </p>

          {/* Location */}
          <p
            className="mt-3 text-sm flex items-center gap-1.5"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {personal.location}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-10">
            <button
              onClick={() => scrollTo("#projects")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "var(--accent)",
                color: "#0d0d0d",
              }}
            >
              View Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <a
              href="/assets/cv-matheus.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              Download CV
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5 mt-8">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={`mailto:${personal.email}`}
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
              aria-label="Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          scroll
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent-mid)" }}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </div>
    </section>
  );
}
