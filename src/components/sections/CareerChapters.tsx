"use client";

import { useEffect, useRef } from "react";

const chapters = [
  {
    id: "android",
    index: "01",
    period: "2022 – 2024",
    label: "Android Systems",
    title: "Deep inside the OS",
    description:
      "Engineered the Android framework at CESAR/Motorola and Instituto Eldorado — shipping large-scale commercial AOSP changes across framework, Camera HAL, and kernel-adjacent layers.",
    stats: [
      { value: "45%", label: "perf gain" },
      { value: "25%", label: "crash reduction" },
      { value: "2", label: "OEMs shipped" },
    ],
    tags: ["AOSP", "Java", "C/C++", "HAL", "Linux Kernel"],
    // Flickr CC aerial Manaus - dark aerial cityscape
    bgUrl: "https://live.staticflickr.com/4295/35073142464_60948bd227_b.jpg",
    accent: "#e5b21a",
  },
  {
    id: "ai",
    index: "02",
    period: "2020 – Present",
    label: "AI / ML Research",
    title: "Intelligence from data",
    description:
      "6 years of R&D at UFAM — 12+ IEEE papers spanning computer vision, time-series anomaly detection, RAG pipelines, speech-to-text, and embedded AI on Jetson Nano and STM32.",
    stats: [
      { value: "12+", label: "IEEE papers" },
      { value: "6", label: "years R&D" },
      { value: "4", label: "institutions" },
    ],
    tags: ["PyTorch", "Detectron2", "RAG", "STM32", "Jetson Nano", "LoRaWAN"],
    // Teatro Amazonas / Amazon river aerial - artistic
    bgUrl: "https://live.staticflickr.com/4329/35743339292_5d74b81e58_b.jpg",
    accent: "#e5b21a",
  },
  {
    id: "kmp",
    index: "03",
    period: "2024 – Present",
    label: "Cross-Platform Mobile",
    title: "One codebase, every platform",
    description:
      "Building scalable B2B products at Stone with Kotlin Multiplatform — sharing business logic across iOS and Android while maintaining platform-native performance and UX.",
    stats: [
      { value: "KMP", label: "architecture" },
      { value: "iOS+", label: "Android" },
      { value: "B2B", label: "at scale" },
    ],
    tags: ["Kotlin Multiplatform", "iOS", "Android", "Swift", "CI/CD"],
    bgUrl: "https://live.staticflickr.com/4295/35073142464_60948bd227_b.jpg",
    accent: "#e5b21a",
  },
];

function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add("visible"), index * 100); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="chapter-card fade-up" style={{ minHeight: "440px" }}>
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div
        className="chapter-card-bg"
        style={{ backgroundImage: `url(${chapter.bgUrl})` }}
        aria-hidden="true"
      />

      {/* Dark overlay + gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(11,13,10,0.92) 0%, rgba(11,13,10,0.75) 50%, rgba(11,13,10,0.92) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-7 flex flex-col h-full" style={{ minHeight: "440px" }}>
        {/* Header row */}
        <div className="flex items-start justify-between mb-auto">
          <div>
            <span
              className="font-mono text-xs tracking-widest uppercase mb-2 block"
              style={{ color: chapter.accent }}
            >
              {chapter.label}
            </span>
            <span
              className="font-mono text-[10px] tracking-wider"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {chapter.period}
            </span>
          </div>
          <span
            className="font-mono text-5xl font-bold"
            style={{ color: "rgba(255,255,255,0.06)", letterSpacing: "-0.05em" }}
          >
            {chapter.index}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-2xl sm:text-3xl font-bold mt-8 mb-3"
          style={{ letterSpacing: "-0.03em", lineHeight: "1.1" }}
        >
          {chapter.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(225,230,225,0.65)" }}
        >
          {chapter.description}
        </p>

        {/* Stats */}
        <div className="flex gap-5 mb-6">
          {chapter.stats.map((s) => (
            <div key={s.label}>
              <p
                className="text-xl font-bold"
                style={{ color: chapter.accent, letterSpacing: "-0.03em" }}
              >
                {s.value}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {chapter.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                border: `1px solid rgba(229,178,26,0.25)`,
                color: "rgba(229,178,26,0.7)",
                background: "rgba(229,178,26,0.06)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CareerChapters() {
  return (
    <section id="career" className="section">
      <div className="container">
        <p className="section-label">Career Chapters</p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Three{" "}
            <span style={{ color: "var(--accent)" }}>disciplines</span>
            ,<br />one engineer
          </h2>
          <p
            className="text-sm max-w-xs"
            style={{ color: "var(--text-muted)", lineHeight: "1.7" }}
          >
            Android systems, AI research, and cross-platform mobile — each phase deeper than the last.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {chapters.map((chapter, i) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
