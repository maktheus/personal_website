"use client";

import { useEffect, useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  tag: Tag = "h1",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const spans = el.querySelectorAll<HTMLSpanElement>(".char");
          spans.forEach((s, i) => {
            setTimeout(() => {
              s.style.opacity = "1";
              s.style.transform = "translateY(0)";
            }, delay + i * 22);
          });
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, text]);

  const chars = text.split("").map((char, i) => (
    <span
      key={i}
      className="char"
      style={{
        display: "inline-block",
        opacity: 0,
        transform: "translateY(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        whiteSpace: char === " " ? "pre" : "normal",
      }}
    >
      {char}
    </span>
  ));

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className} aria-label={text}>
      {chars}
    </Tag>
  );
}
