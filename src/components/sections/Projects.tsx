import SectionWrapper from "@/components/ui/SectionWrapper";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects, personal } from "@/lib/data";

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <div className="container">
        <p className="section-label">Projects</p>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Selected{" "}
            <span style={{ color: "var(--accent)" }}>work</span>
          </h2>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}
          >
            View all 140+ repos on GitHub
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
