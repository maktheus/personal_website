import type { Experience } from "@/types";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export default function TimelineItem({ experience, index }: TimelineItemProps) {
  return (
    <div
      className="relative pl-8 pb-10 last:pb-0 fade-up"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Timeline line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: "var(--border-color)" }}
      />
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-[3.5px] border"
        style={{
          background: "var(--bg)",
          borderColor: "var(--accent)",
          boxShadow: "0 0 8px var(--accent-glow)",
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
        <div>
          <h3 className="font-bold text-base" style={{ letterSpacing: "-0.02em" }}>
            {experience.role}
          </h3>
          <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            {experience.company}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span
            className="font-mono text-xs block"
            style={{ color: "var(--text-muted)" }}
          >
            {experience.period}
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {experience.location}
          </span>
        </div>
      </div>

      <p className="text-sm mb-3" style={{ color: "var(--text-muted)", lineHeight: "1.65" }}>
        {experience.description}
      </p>

      <ul className="space-y-1 mb-3">
        {experience.highlights.map((h, i) => (
          <li
            key={i}
            className="text-xs flex gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span style={{ color: "var(--accent-mid)" }} className="shrink-0 mt-0.5">
              ›
            </span>
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {experience.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
