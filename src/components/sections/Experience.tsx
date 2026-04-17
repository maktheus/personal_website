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
      <div className="container">
        <p className="section-label">Experience</p>

        <div className="grid md:grid-cols-[1fr_2fr] gap-16">
          {/* Left sticky heading with CameraAudio bg */}
          <div className="md:sticky md:top-24 md:self-start relative z-10 overflow-hidden rounded-2xl border" style={{ background: "var(--bg)", borderColor: "var(--border-color)" }}>
            
            <div className="absolute inset-0 z-0 pointer-events-none">
              <CameraAudioCanvas />
              {/* Add a subtle gradient overlay to ensure text is readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/80 to-[var(--bg)]/10 pointer-events-none" />
            </div>

            <div className="relative z-10 p-8 sm:p-10 backdrop-blur-sm bg-[var(--bg)]/30">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg shadow-black"
                style={{ letterSpacing: "-0.03em" }}
              >
                6+ years of<br />
                <span style={{ color: "var(--accent)" }}>shipping</span>
              </h2>
              <p className="text-sm sm:text-base leading-relaxed drop-shadow-md text-white font-medium" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}>
                From embedded Android systems to AI pipelines and cross-platform mobile — across research labs, product companies, and consulting.
              </p>
            </div>
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
