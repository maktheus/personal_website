import { personal } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8" style={{ borderTop: "1px solid var(--border-color)" }}>
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            © {year} Matheus Serrão Uchôa
          </span>

          <div className="flex items-center gap-6">
            <a
              href={`mailto:${personal.email}`}
              className="font-mono text-xs transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              {personal.email}
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              GitHub
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              LinkedIn
            </a>
          </div>

          <span className="font-mono text-xs" style={{ color: "var(--accent-deep)" }}>
            Built with Next.js · Deployed on GitHub Pages
          </span>
        </div>
      </div>
    </footer>
  );
}
