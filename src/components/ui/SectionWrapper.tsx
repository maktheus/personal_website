"use client";

import { useEffect, useRef } from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  delay = 0,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <section
      ref={ref}
      id={id}
      className={`section fade-up ${className}`}
    >
      {children}
    </section>
  );
}
