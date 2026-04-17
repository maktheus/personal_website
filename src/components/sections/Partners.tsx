import SectionWrapper from "@/components/ui/SectionWrapper";

const partners = [
  { name: "Stone", role: "KMP · B2B Mobile", accent: true },
  { name: "CESAR", role: "Android Framework", accent: false },
  { name: "Motorola", role: "AOSP · Commercial Devices", accent: false },
  { name: "Eldorado", role: "Embedded Android", accent: false },
  { name: "UFAM", role: "AI Research · 12+ Papers", accent: false },
  { name: "TPV", role: "Embedded Systems", accent: false },
  { name: "COLTECH", role: "Full-stack · APIs", accent: false },
  { name: "OAB-AM", role: "Systems Development", accent: false },
];

export default function Partners() {
  return (
    <SectionWrapper id="partners">
      <div className="container">
        <p className="section-label">Worked With</p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Companies &{" "}
            <span style={{ color: "var(--accent)" }}>institutions</span>
          </h2>
          <p
            className="text-sm max-w-sm"
            style={{ color: "var(--text-muted)", lineHeight: "1.7" }}
          >
            From research labs to product companies — 6+ years building across industry and academia.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {partners.map((p) => (
            <div
              key={p.name}
              className="partner-badge flex-col gap-1 text-center"
              style={
                p.accent
                  ? {
                      borderColor: "var(--border-accent)",
                      color: "var(--accent)",
                      background: "var(--accent-dim)",
                    }
                  : {}
              }
            >
              <span
                className="font-bold text-sm tracking-tight"
                style={{ color: p.accent ? "var(--accent)" : "var(--text)" }}
              >
                {p.name}
              </span>
              <span
                className="font-mono text-[10px] tracking-wider uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                {p.role}
              </span>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}
        >
          {[
            { value: "6+", label: "Years" },
            { value: "12+", label: "IEEE Papers" },
            { value: "3", label: "Platforms" },
            { value: "8+", label: "Companies" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 gap-1"
              style={{ background: "var(--bg-card)" }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--accent)", letterSpacing: "-0.04em" }}
              >
                {stat.value}
              </span>
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
