import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      className="card group relative overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(229,178,26,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Screenshot image */}
      {project.imageUrl && (
        <div
          className="relative -mx-6 -mt-6 mb-5 overflow-hidden"
          style={{ height: "180px", marginLeft: "-1.5rem", marginRight: "-1.5rem", marginTop: "-1.5rem" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, var(--bg-card) 100%)",
            }}
          />
        </div>
      )}

      {/* Index */}
      <span className="font-mono text-xs mb-3 block" style={{ color: "var(--accent-mid)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3
        className="text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors duration-200"
        style={{ letterSpacing: "-0.02em" }}
      >
        {project.title}
      </h3>

      <p className="text-sm mb-4 flex-1" style={{ color: "var(--text-muted)", lineHeight: "1.65" }}>
        {project.longDescription}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4 pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono flex items-center gap-1.5 transition-colors duration-200 hover:brightness-110"
            style={{ color: "var(--accent)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </article>
  );
}
