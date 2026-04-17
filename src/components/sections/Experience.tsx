import SectionWrapper from "@/components/ui/SectionWrapper";
import TimelineItem from "@/components/ui/TimelineItem";
import { experiences } from "@/lib/data";
import dynamic from "next/dynamic";

const CameraAudioCanvas = dynamic(() => import("@/components/ui/CameraAudioCanvas"), {
  ssr: false,
});

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <div className="relative w-full overflow-hidden min-h-screen">
        {/* Immersive Camera Audio Background for the whole section */}
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-100">
          <CameraAudioCanvas />
          {/* Soft fading gradients to blend with adjacent sections */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--bg)] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
        </div>

        <div className="container relative z-10 py-16">
        <p className="section-label">Experience</p>

        <div className="grid md:grid-cols-[1fr_2fr] gap-16">
          {/* Left sticky heading */}
          <div className="md:sticky md:top-32 md:self-start">
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-md"
              style={{ letterSpacing: "-0.03em" }}
            >
              6+ years of<br />
              <span style={{ color: "var(--accent)" }}>shipping.</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--text-muted)] drop-shadow-sm max-w-sm">
              From embedded Android systems to AI pipelines and cross-platform mobile — across research labs, product companies, and consulting.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative z-10 mt-12 md:mt-0">
            {experiences.map((exp, i) => (
              <TimelineItem key={exp.company + exp.role} experience={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
      </div>
    </SectionWrapper>
  );
}
