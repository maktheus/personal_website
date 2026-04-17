"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Data ──────────────────────────────────────────────── */
type Category = "vision" | "audio" | "genai" | "iot";

interface Paper {
  title: string;
  venue: string;
  year: string;
  description: string;
  category: Category;
  highlight?: string; // key metric / one-liner
}

const papers: Paper[] = [
  // ── Computer Vision ──────────────────────────────────────
  {
    title: "Action and Assembly Time Measurement System using Jetson Nano",
    venue: "IEEE",
    year: "2023",
    description: "Real-time computer vision system measuring assembly time on production lines — edge AI on Jetson Nano with live worker pose estimation.",
    category: "vision",
    highlight: "Real-time · Edge AI",
  },
  {
    title: "Action Recognition of Industrial Workers using Detectron2 and AutoML",
    venue: "IEEE",
    year: "2023",
    description: "Deep learning pipeline classifying industrial worker actions from video. Detectron2 backbone combined with AutoML for architecture search.",
    category: "vision",
    highlight: "Detectron2 · AutoML",
  },
  {
    title: "Automatic Video Labeling with Assembly Actions using ResNet",
    venue: "IEEE",
    year: "2022",
    description: "Automated video annotation pipeline using ResNet for identifying assembly actions — eliminating manual labeling bottlenecks.",
    category: "vision",
    highlight: "ResNet · Auto-annotation",
  },
  {
    title: "Video Artifact Correction using UNet",
    venue: "UFAM",
    year: "2023",
    description: "Deep learning frame reconstruction correcting visual artifacts in industrial video feeds using UNet encoder-decoder architecture.",
    category: "vision",
    highlight: "UNet · Frame reconstruction",
  },
  // ── Audio & Signal ───────────────────────────────────────
  {
    title: "Sound Pressure Level Measurement in Industrial Production using STM32",
    venue: "IEEE",
    year: "2022",
    description: "Embedded real-time industrial audio acquisition and processing system on STM32 microcontroller — measuring environmental noise levels on production floors.",
    category: "audio",
    highlight: "STM32 · Real-time DSP",
  },
  {
    title: "Real-Time TV Commercial Detection using ML",
    venue: "UFAM",
    year: "2023",
    description: "Audio processing pipeline detecting commercial breaks in real time. Speech-to-text + transformer-based classification at the audio signal level.",
    category: "audio",
    highlight: "Transformers · Speech-to-text",
  },
  {
    title: "Signal Descriptor Optimization with C++",
    venue: "CETELI / UFAM",
    year: "2022",
    description: "Latency reduction in signal descriptor computation — low-level C++ optimizations targeting computational efficiency for real-time embedded signal processing.",
    category: "audio",
    highlight: "C++ · Latency −40%",
  },
  // ── Generative AI ────────────────────────────────────────
  {
    title: "RAG Pipeline Optimization and Benchmarking",
    venue: "UFAM / ICOMP",
    year: "2024",
    description: "Modular evaluation framework for Retrieval-Augmented Generation pipelines — benchmarking generative AI quality, hallucination rates, and inference latency.",
    category: "genai",
    highlight: "RAG · LLM Evaluation",
  },
  {
    title: "Anomaly Forecasting using TSMixer",
    venue: "UFAM",
    year: "2024",
    description: "Predictive anomaly detection in industrial time-series sensor data — TSMixer architecture applied to multi-variate industrial sensor streams.",
    category: "genai",
    highlight: "TSMixer · Time-series",
  },
  // ── Industrial IoT ───────────────────────────────────────
  {
    title: "IIoT Data Server with Jetson Nano",
    venue: "UFAM",
    year: "2021",
    description: "Distributed data collection architecture for Industrial Internet of Things — Jetson Nano as edge inference node with cloud data ingestion pipeline.",
    category: "iot",
    highlight: "IIoT · Edge computing",
  },
  {
    title: "LoRaWAN Industrial Sensing Architecture",
    venue: "UFAM",
    year: "2021",
    description: "Microservice-based data ingestion integrating LoRaWAN sensors with backend infrastructure — long-range industrial sensing at low power.",
    category: "iot",
    highlight: "LoRaWAN · LPWAN",
  },
  {
    title: "Industrial Asset Modeling (AAS)",
    venue: "UFAM",
    year: "2022",
    description: "Digital asset modeling and integration for industrial IoT infrastructure using Asset Administration Shell (AAS) standards.",
    category: "iot",
    highlight: "AAS · Digital twin",
  },
];

/* ─── Category config ───────────────────────────────────── */
const CATS: Record<Category, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  vision: {
    label: "Computer Vision",
    color: "#e5b21a",
    bg: "rgba(229,178,26,0.06)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      </svg>
    ),
  },
  audio: {
    label: "Signal & Audio",
    color: "#d97711",
    bg: "rgba(217,119,17,0.06)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  genai: {
    label: "Generative AI",
    color: "#997300",
    bg: "rgba(153,115,0,0.06)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  iot: {
    label: "Industrial IoT",
    color: "#4c7a00",
    bg: "rgba(76,122,0,0.06)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <circle cx="12" cy="10" r="2" />
        <path d="M8.5 7.5a5 5 0 0 1 7 7" />
        <path d="M5.5 4.5a9 9 0 0 1 13 13" />
      </svg>
    ),
  },
};

/* ─── Paper row (expandable) ────────────────────────────── */
function PaperRow({ paper, index }: { paper: Paper; index: number }) {
  const [open, setOpen] = useState(false);
  const cat = CATS[paper.category];

  return (
    <div
      className="paper-row"
      style={{
        borderBottom: "1px solid var(--border-color)",
        transition: "background 0.2s ease",
        background: open ? cat.bg : "transparent",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 px-0 flex items-start gap-4 group"
        aria-expanded={open}
      >
        {/* Index */}
        <span
          className="font-mono text-xs shrink-0 w-8 pt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3
              className="text-sm sm:text-base font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors pr-4"
              style={{ letterSpacing: "-0.01em" }}
            >
              {paper.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider"
              style={{
                background: cat.bg,
                color: cat.color,
                border: `1px solid ${cat.color}33`,
              }}
            >
              {paper.venue}
            </span>
            <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              {paper.year}
            </span>
            {paper.highlight && (
              <span className="font-mono text-[10px]" style={{ color: cat.color, opacity: 0.7 }}>
                · {paper.highlight}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0 mt-1 transition-transform duration-300"
          style={{
            color: open ? cat.color : "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded description */}
      <div
        style={{
          maxHeight: open ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.65,0.05,0,1)",
        }}
      >
        <p
          className="text-sm leading-relaxed pb-5 pl-12"
          style={{ color: "var(--text-muted)" }}
        >
          {paper.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Category column ───────────────────────────────────── */
function CategoryBlock({
  category,
  papers,
  startIdx,
}: {
  category: Category;
  papers: Paper[];
  startIdx: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cat = CATS[category];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="fade-up">
      {/* Category header */}
      <div className="flex items-center gap-3 mb-1 pb-4" style={{ borderBottom: `1px solid ${cat.color}22` }}>
        <span style={{ color: cat.color }}>{cat.icon}</span>
        <span
          className="font-mono text-xs tracking-widest uppercase font-bold"
          style={{ color: cat.color }}
        >
          {cat.label}
        </span>
        <span
          className="font-mono text-xs ml-auto"
          style={{ color: "var(--text-muted)" }}
        >
          {papers.length} paper{papers.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Papers */}
      {papers.map((p, i) => (
        <PaperRow key={p.title} paper={p} index={startIdx + i} />
      ))}
    </div>
  );
}

/* ─── Featured hero paper ───────────────────────────────── */
function FeaturedPaper() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="fade-up relative overflow-hidden rounded-2xl p-8 sm:p-10 mb-16"
      style={{
        border: "1px solid var(--border-accent)",
        background: "var(--bg-card)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(229,178,26,0.08) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-end">
        <div>
          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className="font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{
                background: "var(--accent-dim)",
                color: "var(--accent)",
                border: "1px solid var(--border-accent)",
              }}
            >
              IEEE · Most Recent
            </span>
            <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>2024</span>
          </div>

          {/* Title */}
          <h3
            className="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
            style={{ letterSpacing: "-0.03em", maxWidth: "600px" }}
          >
            RAG Pipeline Optimization<br />
            <span style={{ color: "var(--accent)" }}>& Benchmarking</span>
          </h3>

          <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-muted)" }}>
            Modular evaluation framework for Retrieval-Augmented Generation pipelines — benchmarking
            generative AI quality, hallucination rates, and inference latency across multiple LLMs
            and retrieval strategies.
          </p>
        </div>

        {/* Stats */}
        <div className="flex md:flex-col gap-6 md:gap-4 shrink-0">
          {[
            { v: "RAG", l: "Architecture" },
            { v: "LLM", l: "Evaluation" },
            { v: "2024", l: "Latest" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-mono text-xl font-bold" style={{ color: "var(--accent)" }}>
                {s.v}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Opal-style bottom strip: horizontal list of all IEEE papers */}
      <div
        className="mt-8 pt-6 flex flex-wrap gap-x-6 gap-y-1"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Also IEEE:
        </span>
        {papers
          .filter((p) => p.venue === "IEEE" && p.title !== "RAG Pipeline Optimization and Benchmarking")
          .map((p) => (
            <span
              key={p.title}
              className="font-mono text-[10px]"
              style={{ color: "rgba(229,178,26,0.5)" }}
            >
              {p.year} · {p.title.split(" ").slice(0, 4).join(" ")}…
            </span>
          ))}
      </div>
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────── */
export default function Research() {
  const byCategory = (cat: Category) => papers.filter((p) => p.category === cat);

  // calculate start indexes for row numbering
  const visionStart = 0;
  const audioStart = byCategory("vision").length;
  const genaiStart = audioStart + byCategory("audio").length;
  const iotStart = genaiStart + byCategory("genai").length;

  return (
    <section id="research" className="section">
      <div className="container">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label">Research & Publications</p>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ letterSpacing: "-0.03em" }}
            >
              12 papers<span style={{ color: "var(--accent)" }}>.</span><br />
              4 disciplines<span style={{ color: "var(--accent)" }}>.</span>
            </h2>
          </div>
          <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)", lineHeight: "1.7" }}>
            Published with CESAR Institute, CETELI/UFAM, ICOMP/UFAM, Motorola, and TPV — including 5 IEEE events.
          </p>
        </div>

        {/* Featured paper — Opal hero-style */}
        <FeaturedPaper />

        {/* Opal-style: two-column category grid */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          <CategoryBlock category="vision" papers={byCategory("vision")} startIdx={visionStart} />
          <CategoryBlock category="audio" papers={byCategory("audio")} startIdx={audioStart} />
          <CategoryBlock category="genai" papers={byCategory("genai")} startIdx={genaiStart} />
          <CategoryBlock category="iot" papers={byCategory("iot")} startIdx={iotStart} />
        </div>

        {/* Opal-style bottom strip: timeline view */}
        <div
          className="mt-16 pt-8 overflow-x-auto"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Timeline 2021 — 2024
          </p>
          <div className="flex gap-0 min-w-max">
            {["2021", "2022", "2023", "2024"].map((year) => {
              const yearPapers = papers.filter((p) => p.year === year);
              return (
                <div
                  key={year}
                  className="flex flex-col"
                  style={{ width: "180px", paddingRight: "24px" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="font-mono text-lg font-bold"
                      style={{ color: "var(--accent)", letterSpacing: "-0.03em" }}
                    >
                      {year}
                    </span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {yearPapers.length}p
                    </span>
                  </div>
                  {/* Timeline bar */}
                  <div
                    className="h-0.5 mb-3 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, var(--accent) 0%, transparent 100%)`,
                      width: `${yearPapers.length * 25}%`,
                    }}
                  />
                  <div className="space-y-2">
                    {yearPapers.map((p) => (
                      <div key={p.title} className="flex items-start gap-1.5">
                        <span
                          className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                          style={{ background: CATS[p.category].color }}
                        />
                        <span
                          className="font-mono text-[10px] leading-snug"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {p.title.split(" ").slice(0, 5).join(" ")}…
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
