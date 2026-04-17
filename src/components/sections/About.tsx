import SectionWrapper from "@/components/ui/SectionWrapper";
import { personal, marqueeSkills, skills } from "@/lib/data";

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="container">
        <p className="section-label">About</p>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Building systems that{" "}
              <span style={{ color: "var(--accent)" }}>scale</span> and{" "}
              <span style={{ color: "var(--accent)" }}>learn</span>
            </h2>

            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              {personal.bio}
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Years experience", value: "6+" },
                { label: "Published papers", value: "12+" },
                { label: "Platforms shipped", value: "iOS · Android · Web" },
                { label: "Open to", value: "Remote / Relocation" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="p-4 rounded-lg"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <p
                    className="font-bold text-lg"
                    style={{ color: "var(--accent)", letterSpacing: "-0.02em" }}
                  >
                    {fact.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills by category */}
          <div className="space-y-6">
            {[
              { cat: "core", label: "Languages & Core" },
              { cat: "mobile", label: "Mobile & Systems" },
              { cat: "ai", label: "AI / ML" },
              { cat: "backend", label: "Backend" },
              { cat: "tools", label: "Tools & Infra" },
            ].map(({ cat, label }) => (
              <div key={cat}>
                <p
                  className="font-mono text-xs mb-2"
                  style={{ color: "var(--accent-mid)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  {label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <span key={s.label} className="tag">
                        {s.label}
                      </span>
                    ))}
                </div>
              </div>
            ))}

            {/* Languages */}
            <div>
              <p
                className="font-mono text-xs mb-2"
                style={{ color: "var(--accent-mid)", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["PT — Native", "EN — Professional", "ES — Basic", "FR — Basic"].map((l) => (
                  <span key={l} className="tag accent">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills marquee */}
      <div className="mt-16 py-6" style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="marquee-outer">
          <div className="marquee-track">
            {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
              <span
                key={i}
                className="font-mono text-sm px-8 shrink-0"
                style={{
                  color: i % 5 === 0 ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {skill}
                <span style={{ color: "var(--accent-deep)", margin: "0 1rem" }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
