import SectionWrapper from "@/components/ui/SectionWrapper";
import { publications } from "@/lib/data";

export default function Research() {
  return (
    <SectionWrapper id="research">
      <div className="container">
        <p className="section-label">Research</p>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            12+{" "}
            <span style={{ color: "var(--accent)" }}>publications</span>
          </h2>
          <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
            Published in IEEE events and academic venues, in partnership with CESAR Institute, CETELI/UFAM, ICOMP/UFAM, Motorola, and TPV.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publications.map((pub, i) => (
            <article
              key={i}
              className="card group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Venue badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded"
                  style={{
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                    border: "1px solid var(--border-accent)",
                  }}
                >
                  {pub.venue}
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {pub.year}
                </span>
              </div>

              <h3
                className="text-sm font-semibold mb-2 leading-snug group-hover:text-[var(--accent)] transition-colors"
                style={{ letterSpacing: "-0.01em" }}
              >
                {pub.title}
              </h3>

              {pub.description && (
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {pub.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
