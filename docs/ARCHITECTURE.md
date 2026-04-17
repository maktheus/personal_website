# Architecture Specification
## Personal Portfolio Website

**Version:** 1.0.0  
**Status:** Implemented  
**Last Updated:** 2026-04-17

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js 14 App Router (SSG)              │  │
│  │  ┌──────────┐  ┌────────────┐  ┌─────────────┐  │  │
│  │  │  Layout  │  │   Lenis    │  │  BoidsCanvas│  │  │
│  │  │  Header  │  │  Provider  │  │  (Canvas 2D)│  │  │
│  │  │  Footer  │  │            │  │             │  │  │
│  │  └──────────┘  └────────────┘  └─────────────┘  │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │              Page Sections               │   │  │
│  │  │  Hero → About → Experience →             │   │  │
│  │  │  Projects → Research → Contact           │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
           │ static files served from
┌──────────▼───────────┐
│   GitHub Pages CDN   │  ← ./out/ from next build
│  maktheus.github.io  │
│  /personal_website/  │
└──────────────────────┘
           ▲
           │ automated via
┌──────────┴───────────┐
│   GitHub Actions     │
│   deploy.yml         │
│   (push → main)      │
└──────────────────────┘
```

---

## 2. Tech Stack

### Core
| Layer | Technology | Version | Justification |
|---|---|---|---|
| Framework | Next.js | 14.2.x | App Router, static export, built-in optimization |
| Language | TypeScript | 5.x | Type safety, consistent with user's existing repos |
| Styling | Tailwind CSS | 3.4.x | Utility-first, minimal runtime |
| Styling (theme) | CSS Custom Properties | — | Zero-JS theme switching, inherited by all components |

### Animation & UX
| Layer | Technology | Justification |
|---|---|---|
| Smooth scroll | Lenis 1.1.x | GPU-accelerated, used by all 4 reference sites |
| Page animations | IntersectionObserver API | No library dependency, performant |
| Boids simulation | Canvas 2D API | Custom, no deps, full control |
| Component motion | Framer Motion 11.x | Declarative, tree-shakeable |

### Fonts
| Font | Usage | Format |
|---|---|---|
| Geist Sans | All body and heading text | Variable font (single file) |
| Geist Mono | Code, tags, labels, nav logo | Variable font (single file) |

### Infrastructure
| Layer | Technology |
|---|---|
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Build output | Static (`./out`) |

---

## 3. Directory Structure

```
personal_website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Build + deploy to GitHub Pages on push to main
├── docs/                       # Project specifications (this folder)
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── COMPONENT_SPECS.md
│   └── DEPLOYMENT.md
├── public/
│   ├── favicon.ico
│   ├── og-image.png            # 1200×630 Open Graph preview image
│   └── assets/
│       └── cv-matheus.pdf      # Downloadable resume
├── src/
│   ├── app/
│   │   ├── globals.css         # Design tokens, base styles, animations
│   │   ├── layout.tsx          # Root layout: metadata, fonts, body
│   │   └── page.tsx            # Composes all sections
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Sticky nav, theme toggle, mobile menu
│   │   │   ├── Footer.tsx      # Social links, copyright
│   │   │   └── LenisProvider.tsx # Client-side Lenis init wrapper
│   │   ├── sections/
│   │   │   ├── Hero.tsx        # Full-viewport hero + Boids
│   │   │   ├── About.tsx       # Bio, skill categories, languages, marquee
│   │   │   ├── Experience.tsx  # Timeline of 6 roles
│   │   │   ├── Projects.tsx    # 4 featured project cards
│   │   │   ├── Research.tsx    # 12 publication cards
│   │   │   └── Contact.tsx     # Email CTA, LinkedIn, education
│   │   └── ui/
│   │       ├── BoidsCanvas.tsx  # Canvas 2D boids simulation
│   │       ├── SectionWrapper.tsx # IntersectionObserver fade-up wrapper
│   │       ├── AnimatedText.tsx # Character-by-character reveal
│   │       ├── ProjectCard.tsx  # Project card with hover glow
│   │       ├── TimelineItem.tsx # Experience timeline row
│   │       └── SkillBadge.tsx   # Tag pill component
│   ├── lib/
│   │   ├── lenis.ts            # Lenis init, scrollTo helper
│   │   └── data.ts             # All content: experience, projects, publications
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── next.config.ts              # output: export, basePath for GitHub Pages
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Data Flow

```
data.ts (static content)
    │
    ├──► page.tsx
    │        │
    │        ├──► Hero.tsx ──────► BoidsCanvas.tsx (Canvas 2D)
    │        ├──► About.tsx ─────► marqueeSkills[], skills[]
    │        ├──► Experience.tsx ► TimelineItem[] ← experiences[]
    │        ├──► Projects.tsx ──► ProjectCard[] ← projects[]
    │        ├──► Research.tsx ──► publication cards ← publications[]
    │        └──► Contact.tsx ───► personal{}
    │
    └──► Header.tsx (scrollTo via lenis.ts)
```

---

## 5. Key Technical Decisions

### 5.1 Static Export over SSR
**Decision:** `output: "export"` in next.config.ts  
**Reason:** Portfolio is 100% static content. No SSR overhead, no server cost, perfect GitHub Pages compatibility.  
**Trade-off:** No server-side data fetching. Acceptable since all data is in `data.ts`.

### 5.2 Lenis over Native Smooth Scroll
**Decision:** Lenis library for scroll  
**Reason:** CSS `scroll-behavior: smooth` can't be controlled programmatically (no easing, no offset). Lenis enables custom easing curves and `scrollTo(target)` with offset — required for sticky header compensation.  
**Trade-off:** 7KB gzipped dependency.

### 5.3 Canvas 2D Boids over Three.js/WebGL
**Decision:** Raw Canvas 2D API for the Boids simulation  
**Reason:** Three.js is ~600KB. Canvas 2D achieves the same visual effect at zero additional dependency cost. Portfolio performance > visual complexity.  
**Trade-off:** No GPU acceleration; limited to ~100-150 boids at 60fps on low-end mobile.

### 5.4 CSS Custom Properties for Theming
**Decision:** `[data-theme]` / `.light` class + CSS variables  
**Reason:** Instant theme switch without JS re-renders. All colors are CSS variables consumed by Tailwind and raw CSS alike.  
**Trade-off:** Not SSR-aware (flash of wrong theme possible on hydration). Mitigated by defaulting to dark and detecting system preference client-side.

### 5.5 IntersectionObserver over Scroll Event Listeners
**Decision:** IO API for all fade-up animations  
**Reason:** IO is passive and runs off the main thread. Zero scroll jank. Cleaner than scroll listeners.  
**Trade-off:** No percentage-based scroll triggers (only enter/exit viewport).

---

## 6. Performance Budget

| Asset | Target |
|---|---|
| Total JS (gzipped) | < 150KB |
| Total CSS (gzipped) | < 20KB |
| Web fonts | < 60KB (Geist variable) |
| Images | Lazy-loaded, WebP preferred |
| **LCP** | **< 2.5s** |
| **CLS** | **< 0.1** |
| **FID** | **< 100ms** |
