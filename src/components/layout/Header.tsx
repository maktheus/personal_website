"use client";

import { useEffect, useRef, useState } from "react";
import { scrollTo } from "@/lib/lenis";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Career", href: "#career" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
  }

  function handleNav(href: string) {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      scrollTo(href);
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(13,13,13,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-color)" : "1px solid transparent",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollTo(0)}
              className="font-mono text-sm font-bold tracking-wider transition-colors hover:text-[var(--accent)]"
              style={{ letterSpacing: "0.1em" }}
            >
              MSU<span style={{ color: "var(--accent)" }}>.</span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="text-sm transition-colors hover:text-[var(--accent)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ border: "1px solid var(--border-color)" }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className="block w-5 h-px transition-all duration-200"
                  style={{
                    background: "var(--text)",
                    transform: menuOpen ? "rotate(45deg) translate(2px, 2px)" : "none",
                  }}
                />
                <span
                  className="block w-5 h-px transition-all duration-200"
                  style={{
                    background: "var(--text)",
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="block w-5 h-px transition-all duration-200"
                  style={{
                    background: "var(--text)",
                    transform: menuOpen ? "rotate(-45deg) translate(2px, -2px)" : "none",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          background: "rgba(13,13,13,0.97)",
          backdropFilter: "blur(20px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-2xl font-bold transition-colors hover:text-[var(--accent)]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
