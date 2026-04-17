# Component Specifications
## Personal Portfolio Website

**Version:** 1.0.0  
**Last Updated:** 2026-04-17

---

## Component Map

```
src/components/
├── layout/
│   ├── Header            — Sticky nav with scroll-aware theming
│   ├── Footer            — Social links, copyright
│   └── LenisProvider     — Client-side smooth scroll init
├── sections/
│   ├── Hero              — Full-viewport landing with Boids
│   ├── About             — Bio, skills, languages, marquee
│   ├── Experience        — Timeline of 6 roles
│   ├── Projects          — 4 project cards in a grid
│   ├── Research          — 12 publication cards
│   └── Contact           — Email CTA, LinkedIn, education facts
└── ui/
    ├── BoidsCanvas       — Canvas 2D interactive particle simulation
    ├── SectionWrapper    — IntersectionObserver fade-up HOC
    ├── AnimatedText      — Character-by-character text reveal
    ├── ProjectCard       — Project card with hover glow + links
    ├── TimelineItem      — Single experience timeline row
    └── SkillBadge        — Tag pill
```

---

## Layout Components

### `Header`
**Type:** Client Component (`"use client"`)  
**State:** `scrolled: boolean`, `menuOpen: boolean`, `theme: "dark" | "light"`

**Behavior:**
- On scroll > 40px: applies glass-morphism background (`rgba(13,13,13,0.85)` + `backdrop-filter: blur(16px)`)
- Theme toggle: toggles `.light` class on `<html>`
- Mobile menu: full-screen overlay with all nav links
- `scrollTo()` uses Lenis with `offset: -80` to account for sticky header height

**Props:** none (reads from `data.ts::personal`)

**Nav links:** About · Experience · Projects · Research · Contact

---

### `Footer`
**Type:** Server Component  
**Content:** Copyright year, email, GitHub, LinkedIn, built-with note

---

### `LenisProvider`
**Type:** Client Component  
**Responsibility:** Calls `initLenis()` on mount via `useEffect`.  
Wraps entire page tree so all child `scrollTo` calls have access to the Lenis instance.

---

## Section Components

### `Hero`
**Type:** Client Component  
**Contains:** `BoidsCanvas` (dynamic import, `ssr: false`)

**Layout:**
```
[Full viewport height, flex column, justify-center]
  ├── BoidsCanvas (absolute, full canvas, pointer-events auto)
  ├── Radial gradient mask (text area protected)
  ├── Content block (max-w-3xl)
  │   ├── Status badge (pulsing dot + "Available" text)
  │   ├── Name (3 lines: Matheus / Serrão / Uchôa — middle word in accent)
  │   ├── Title + subtitle (muted)
  │   ├── Location (with SVG pin icon)
  │   ├── CTAs: [View Work] [Download CV]
  │   └── Social icons: GitHub · LinkedIn · Email
  └── Scroll indicator (centered bottom, bouncing)
```

**Interactions:**
- "View Work" → `scrollTo("#projects")`
- "Download CV" → `href="/assets/cv-matheus.pdf" download`
- Social icons → external links

---

### `About`
**Type:** Server Component  
**Sections:**
1. Left column: headline, bio paragraph, 2×2 quick-facts grid
2. Right column: skills organized by 5 categories + languages row
3. Full-width skills marquee (below the grid)

**Quick facts:**
- 6+ years experience
- 12+ published papers
- iOS · Android · Web (platforms)
- Remote / Relocation (availability)

---

### `Experience`
**Type:** Server Component  
**Layout:** 2-column on desktop (left: sticky heading, right: timeline)  
**Timeline order:** Most recent first (Stone → CESAR → Eldorado → UFAM R&D → UFAM FS → COLTECH)  
**Per item:** Role, company (accent color), period + location (mono, right-aligned), description, highlights list (›-prefixed), tags

---

### `Projects`
**Type:** Server Component  
**Grid:** 2-column on sm+  
**4 projects:** Game-concurso, Back-End-Tcc, Water Quality App, AI Dashboard  
**Link to:** GitHub profile (all 140+ repos) in section header

---

### `Research`
**Type:** Server Component  
**Grid:** 1 → 2 → 3 columns  
**Per card:** Venue badge (accent), year (mono), title (hover → accent), description  
**12 publications** from UFAM R&D period (IEEE, ICOMP, CETELI)

---

### `Contact`
**Type:** Server Component  
**Headline:** "Let's work together."  
**CTAs:** Email button (primary, accent fill) + LinkedIn button (ghost)  
**Footer facts:** Education (UFAM CompEng + AI Master's 2026), location

---

## UI Components

### `BoidsCanvas`
**Type:** Client Component  
**Rendering:** Canvas 2D, 60fps `requestAnimationFrame` loop  
**Algorithm:**
```
For each boid i:
  1. Find neighbors within PERCEPTION_RADIUS (80px)
  2. Compute:
     - Alignment: average velocity of neighbors × 0.9
     - Cohesion: steer toward average position × 0.6
     - Separation: repel from boids within AVOID_RADIUS (28px) × 1.4
  3. Mouse flee: if within 120px, apply outward force × 0.6
  4. Clamp speed to [0.8, 2.2]
  5. Wrap edges (toroidal space)
  6. Draw:
     - Tail: 8-point history, gradient stroke (semi-transparent)
     - Body: triangle (rotated to heading), linear gradient
       from --accent-deep to --accent based on speed
```

**Cleanup:** `cancelAnimationFrame` + event listener removal on unmount

---

### `SectionWrapper`
**Type:** Client Component  
**Props:** `id`, `className`, `delay` (ms, for stagger)  
**Behavior:**  
Wraps `<section>` with `.fade-up` class. On IntersectionObserver fire (threshold: 0.08), adds `.visible` class after optional delay. Disconnects observer after first trigger.

---

### `AnimatedText`
**Type:** Client Component  
**Props:** `text`, `className`, `delay`, `tag` (h1/h2/h3/p/span)  
**Behavior:**  
Splits `text` into individual `<span class="char">` elements. On intersection, applies per-character delay (22ms stagger) to reveal via opacity + translateY.

---

### `ProjectCard`
**Props:** `project: Project`, `index: number`

```typescript
interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}
```

**Hover behavior:** Radial gradient glow appears, border shifts to `--border-accent`, title color → `--accent`

---

### `TimelineItem`
**Props:** `experience: Experience`, `index: number`

```typescript
interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
}
```

**Stagger delay:** `index × 80ms` via `transitionDelay` inline style

---

### `SkillBadge`
**Props:** `label: string`, `accent?: boolean`  
**Renders:** `.tag` or `.tag.accent` pill
