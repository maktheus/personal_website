"use client";

import { useEffect, useRef } from "react";

/* ─── Unsplash direct-serve URLs (free, no attribution needed for display) */
const IMGS = {
  android:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=75&auto=format&fit=crop",
  ai: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=75&auto=format&fit=crop",
  kmp: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=75&auto=format&fit=crop",
};

/* CSS gradient fallbacks (always show if image fails / while loading) */
const FALLBACKS = {
  android: "linear-gradient(135deg, #0b1a0b 0%, #1a2a10 50%, #0b0d0a 100%)",
  ai:      "linear-gradient(135deg, #0a0b1a 0%, #1a1030 50%, #0b0d0a 100%)",
  kmp:     "linear-gradient(135deg, #1a0b0b 0%, #2a1010 50%, #0b0d0a 100%)",
};

const chapters = [
  {
    id: "android" as const,
    index: "01",
    period: "2022 – 2024",
    label: "Android Systems",
    title: "Deep inside\nthe OS",
    description:
      "Engineered AOSP at the framework layer for CESAR/Motorola and Instituto Eldorado — shipping framework changes across Camera HAL, rendering, brightness, and HAL-kernel boundary.",
    stats: [
      { value: "45%", label: "perf gain" },
      { value: "25%", label: "crash ↓" },
      { value: "2", label: "OEMs" },
    ],
    tags: ["AOSP", "Java", "C/C++", "HAL", "Linux Kernel"],
  },
  {
    id: "ai" as const,
    index: "02",
    period: "2020 – Present",
    label: "AI / ML Research",
    title: "Intelligence\nfrom data",
    description:
      "6 years of R&D at UFAM — 12+ papers spanning computer vision, time-series anomaly detection, RAG pipelines, speech-to-text, and embedded AI on Jetson Nano and STM32.",
    stats: [
      { value: "12+", label: "papers" },
      { value: "5", label: "IEEE" },
      { value: "4", label: "institutions" },
    ],
    tags: ["PyTorch", "Detectron2", "RAG", "STM32", "Jetson Nano"],
  },
  {
    id: "kmp" as const,
    index: "03",
    period: "2024 – Present",
    label: "Cross-Platform Mobile",
    title: "One codebase,\nevery platform",
    description:
      "Building scalable B2B products at Stone with Kotlin Multiplatform — sharing business logic across iOS and Android while maintaining platform-native performance and UX.",
    stats: [
      { value: "KMP", label: "architecture" },
      { value: "iOS+", label: "Android" },
      { value: "B2B", label: "at scale" },
    ],
    tags: ["Kotlin Multiplatform", "iOS", "Android", "Swift", "CI/CD"],
  },
];

function ChapterCard({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), index * 120);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="chapter-card fade-up" style={{ minHeight: "460px" }}>
      {/* Gradient fallback always visible */}
      <div
        className="absolute inset-0"
        style={{ background: FALLBACKS[chapter.id], borderRadius: "inherit" }}
      />

      {/* Photo layer — lazy loaded, fades in on load */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={IMGS[chapter.id]}
        alt=""
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 w-full h-full object-cover chapter-card-bg"
        style={{ opacity: 0, transition: "opacity 0.8s ease" }}
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.opacity = "0.35";
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(11,13,10,0.88) 0%, rgba(11,13,10,0.6) 50%, rgba(11,13,10,0.92) 100%)",
          borderRadius: "inherit",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          borderRadius: "inherit",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 p-7 sm:p-8 flex flex-col h-full"
        style={{ minHeight: "460px" }}
      >
        <div className="flex items-start justify-between mb-auto">
          <div>
            <span
              className="font-mono text-xs tracking-widest uppercase mb-1 block"
              style={{ color: "var(--accent)" }}
            >
              {chapter.label}
            </span>
            <span
              className="font-mono text-[10px] tracking-wider"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {chapter.period}
            </span>
          </div>
          <span
            className="font-mono text-6xl font-black"
            style={{
              color: "rgba(255,255,255,0.04)",
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            {chapter.index}
          </span>
        </div>

        <h3
          className="text-2xl sm:text-3xl font-bold mt-8 mb-3"
          style={{
            letterSpacing: "-0.03em",
            lineHeight: "1.1",
            whiteSpace: "pre-line",
          }}
        >
          {chapter.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(225,230,225,0.6)", maxWidth: "360px" }}
        >
          {chapter.description}
        </p>

        {/* Stats */}
        <div className="flex gap-6 mb-6">
          {chapter.stats.map((s) => (
            <div key={s.label}>
              <p
                className="text-xl font-bold"
                style={{ color: "var(--accent)", letterSpacing: "-0.03em" }}
              >
                {s.value}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.35)" }}
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
                border: "1px solid rgba(229,178,26,0.2)",
                color: "rgba(229,178,26,0.65)",
                background: "rgba(229,178,26,0.05)",
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

/* ─── Opal-style photo strip between sections ─────────── */
function PhotoStrip() {
  const imgs = [
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70&auto=format&fit=crop",
      alt: "Manaus aerial view",
    },
    {
      src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=70&auto=format&fit=crop",
      alt: "Technology abstraction",
    },
    {
      src: "https://images.unsplash.com/photo-1526378787940-576a539ba69d?w=600&q=70&auto=format&fit=crop",
      alt: "Industrial sensors",
    },
    {
      src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=70&auto=format&fit=crop",
      alt: "Code and development",
    },
    {
      src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=70&auto=format&fit=crop",
      alt: "Mobile development",
    },
  ];

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "220px", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}
    >
      {/* Mask edges */}
      <div
        className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, var(--bg) 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, var(--bg) 0%, transparent 100%)" }}
      />

      {/* Scrolling strip */}
      <div
        className="flex gap-3 h-full items-stretch"
        style={{
          width: "max-content",
          animation: "marquee 40s linear infinite",
        }}
      >
        {[...imgs, ...imgs].map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden rounded-xl"
            style={{ width: "320px", height: "100%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(0.55) saturate(0.7)",
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLImageElement).style.filter = "brightness(0.8) saturate(1)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLImageElement).style.filter = "brightness(0.55) saturate(0.7)";
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CareerChapters() {
  return (
    <>
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

      {/* Opal-style scrolling photo strip */}
      <PhotoStrip />
    </>
  );
}
