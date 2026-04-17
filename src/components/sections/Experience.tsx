import SectionWrapper from "@/components/ui/SectionWrapper";
import TimelineItem from "@/components/ui/TimelineItem";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <div className="container">
        <p className="section-label">Experience</p>

        <div className="grid md:grid-cols-[1fr_2fr] gap-16">
          {/* Left sticky heading */}
          <div className="md:sticky md:top-24 md:self-start">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              6+ years of<br />
              <span style={{ color: "var(--accent)" }}>shipping</span>
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              From embedded Android systems to AI pipelines and cross-platform mobile — across research labs, product companies, and consulting.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.company + exp.role} experience={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
