# Design System Specification
## Personal Portfolio Website

**Version:** 1.0.0  
**Last Updated:** 2026-04-17

---

## 1. Color Palette

### Source Palette
Inspired by the user-provided hex swatch.

| Token | Hex | RGBA | Role |
|---|---|---|---|
| `--accent` | `#EAF205` | `rgba(234, 242, 5, 1)` | Primary accent, CTAs, highlights |
| `--accent-warm` | `#F2E205` | `rgba(242, 226, 5, 1)` | Warm accent variant |
| `--accent-mid` | `#A69B0A` | `rgba(166, 155, 10, 1)` | Muted accent, section labels, tags |
| `--accent-deep` | `#594C0C` | `rgba(89, 76, 12, 1)` | Deep accent, timeline dots glow |
| `--bg` | `#0D0D0D` | `rgba(13, 13, 13, 1)` | Background (dark mode) |

### Full Token Set

#### Dark Mode (default)
```css
:root {
  --bg:            #0d0d0d;
  --bg-secondary:  #111111;
  --bg-card:       #161616;
  --text:          #f0f0f0;
  --text-muted:    #777777;
  --accent:        #eaf205;
  --accent-warm:   #f2e205;
  --accent-mid:    #a69b0a;
  --accent-deep:   #594c0c;
  --accent-dim:    rgba(234, 242, 5, 0.10);
  --accent-glow:   rgba(234, 242, 5, 0.25);
  --border-color:  rgba(255, 255, 255, 0.07);
  --border-accent: rgba(234, 242, 5, 0.20);
}
```

#### Light Mode
```css
.light {
  --bg:            #fafaf0;
  --bg-secondary:  #f0f0e0;
  --bg-card:       #ffffff;
  --text:          #0d0d0d;
  --text-muted:    #555544;
  --accent:        #594c0c;
  --accent-warm:   #a69b0a;
  --accent-mid:    #a69b0a;
  --accent-deep:   #594c0c;
  --accent-dim:    rgba(89, 76, 12, 0.08);
  --accent-glow:   rgba(89, 76, 12, 0.15);
  --border-color:  rgba(0, 0, 0, 0.08);
  --border-accent: rgba(89, 76, 12, 0.20);
}
```

---

## 2. Typography

### Font Family
**Geist** (variable font by Vercel)  
- Single `.woff2` file covers weight 100–900  
- Eliminates multiple HTTP requests for different weights  
- Loaded via `geist` npm package (Next.js native)

```css
font-family: var(--font-geist-sans), system-ui, sans-serif;
font-family: var(--font-geist-mono), monospace; /* tags, labels */
```

### Type Scale

| Level | Size | Weight | Letter-spacing | Usage |
|---|---|---|---|---|
| `h1` | 5rem–8rem (fluid) | 700 | −0.04em | Hero name |
| `h2` | 2.25rem–3rem | 700 | −0.03em | Section headings |
| `h3` | 1.125rem | 700 | −0.02em | Card titles |
| Body | 1rem | 400 | 0 | Paragraphs |
| Body SM | 0.875rem | 400 | 0 | Descriptions |
| Mono XS | 0.7rem | 500 | +0.05em–0.15em | Tags, labels, nav logo |

### Key Typography Rules
- Always use negative letter-spacing for headings (tighter = more premium)
- Mono font for all labels, tags, timestamps, and the nav logo
- `font-display: swap` prevents FOIT on first load
- Color contrast: `--text` on `--bg` meets WCAG AA (≥ 4.5:1)

---

## 3. Spacing

All spacing follows Tailwind's default 4px grid.

| Token | Value | Usage |
|---|---|---|
| Section padding | `7rem 0` (112px) | Vertical section rhythm |
| Container max-width | `1120px` | Content area |
| Container horizontal padding | `1.5rem` (24px) | Mobile safe area |
| Card padding | `1.5rem` (24px) | Card internal spacing |
| Card gap | `1.25rem` (20px) | Grid gap between cards |

---

## 4. Borders & Radius

| Token | Value | Usage |
|---|---|---|
| Card radius | `12px` | All cards |
| Button radius | `8px` | Primary/secondary buttons |
| Tag radius | `999px` | Pill tags |
| Timeline dot | `50%` | Circle dot |
| Border width | `1px` | All borders |
| Default border | `rgba(255,255,255,0.07)` | Subtle dark mode borders |
| Accent border | `rgba(234,242,5,0.20)` | Hover/active state |

---

## 5. Shadows & Glows

```css
/* Accent glow (hero CTA, timeline dot) */
box-shadow: 0 0 24px var(--accent-glow), 0 0 48px var(--accent-dim);

/* Card hover */
border-color: var(--border-accent);
transform: translateY(-2px);
```

---

## 6. Animation System

### Scroll-Triggered Fade-Up
- **Trigger:** IntersectionObserver (threshold: 0.08)
- **Effect:** `opacity: 0 → 1`, `translateY: 28px → 0`
- **Duration:** 650ms ease
- **Stagger:** 80ms per item in lists

### Character Reveal (Hero name)
- Each character animates independently
- Delay: 22ms per character after section enters viewport
- Effect: `opacity: 0 → 1`, `translateY: 20px → 0`, 400ms ease

### Marquee
- **Direction:** Left (RTL)
- **Duration:** 35s linear infinite
- **Mask:** Gradient fade on both edges
- **Pause on hover:** `animation-play-state: paused`

### Boids Simulation
- 80 agents initialized with random positions and velocities
- Three steering behaviors: alignment, cohesion, separation
- Mouse repulsion radius: 120px, strength: 0.6
- Speed range: 0.8–2.2 units/frame
- Tail: 8-point history, gradient stroke
- Body: triangle shape, gradient fill (accent-deep → accent)
- Canvas wrapped in `requestAnimationFrame` loop

### Easing
```
Default ease:    cubic-bezier(0.65, 0.05, 0, 1)   — fast start, smooth end
Lenis easing:    t => Math.min(1, 1.001 - 2^(-10t)) — exponential out
```

---

## 7. Component Patterns

### Section Label
```
[24px line] — SECTION NAME
color: --accent-mid
font: mono 0.7rem, letter-spacing 0.15em, uppercase
```

### CTA Button (Primary)
```
background: --accent (#EAF205)
color: #0d0d0d (always dark text for contrast on yellow)
padding: 0.75rem 1.5rem
border-radius: 8px
hover: scale(1.03)
```

### CTA Button (Secondary / Ghost)
```
background: transparent
border: 1px solid --border-color
color: --text-muted
hover: border-color --accent, color --accent
```

### Tag Pill (default)
```
background: --bg-secondary
border: 1px solid --border-color
color: --text-muted
font: mono 0.68rem uppercase
padding: 0.2rem 0.65rem
border-radius: 999px
```

### Tag Pill (accent)
```
background: --accent-dim
border: 1px solid --accent-mid
color: --accent
```

---

## 8. Responsive Breakpoints

| Name | Min-width | Target |
|---|---|---|
| Mobile | 375px | iPhone SE |
| Tablet | 768px (md) | iPad portrait |
| Desktop | 1024px (lg) | Small laptop |
| Wide | 1280px (xl) | Standard desktop |

### Layout Shifts at Breakpoints
- **Hero:** Single column → `max-w-3xl` with boids on right half (md+)
- **About:** Single column → 2-column grid (md+)
- **Experience:** Single column → 3-col sticky sidebar + timeline (md+)
- **Projects:** Single column → 2-column grid (sm+)
- **Research:** Single column → 2-col → 3-col grid (sm+, lg+)
- **Nav:** Hamburger → full horizontal links (md+)
