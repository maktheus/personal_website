import SectionWrapper from "@/components/ui/SectionWrapper";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="container">
        <p className="section-label">Contact</p>

        <div className="max-w-2xl">
          <h2
            className="text-4xl sm:text-6xl font-bold mb-6"
            style={{ letterSpacing: "-0.04em" }}
          >
            Let&apos;s{" "}
            <span style={{ color: "var(--accent)" }}>work</span>
            <br />
            together.
          </h2>

          <p className="text-base mb-10" style={{ color: "var(--text-muted)", lineHeight: "1.7" }}>
            Open to international opportunities — remote or relocation. Whether you&apos;re building a product, scaling a system, or researching something new, I&apos;d love to hear about it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "var(--accent)", color: "#0d0d0d" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {personal.email}
            </a>

            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              linkedin.com/in/maktheus
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{ border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              github.com/maktheus
            </a>
          </div>

          <div className="gradient-line mt-16" />

          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6">
            {[
              { label: "Education", value: "Computer Engineering — UFAM" },
              { label: "Master's", value: "Artificial Intelligence — UFAM (2026)" },
              { label: "Location", value: "Manaus, Amazonas, Brazil" },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.label}
                </p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
