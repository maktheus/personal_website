# Product Requirements Document (PRD)
## Personal Portfolio Website — Matheus Serrão Uchôa

**Version:** 1.0.0  
**Status:** In Development  
**Owner:** Matheus Serrão Uchôa  
**Last Updated:** 2026-04-17

---

## 1. Executive Summary

A high-quality personal portfolio website for Matheus Serrão Uchôa, a Software Engineer specializing in Kotlin Multiplatform (KMP), Android AOSP, and AI/ML systems. The site targets international engineering teams and recruiters, serving as the primary professional presence to support relocation and remote work opportunities.

---

## 2. Problem Statement

Matheus has 6+ years of experience across embedded Android, cross-platform mobile, and AI research, but lacks a centralized, visually compelling web presence that communicates depth and range. LinkedIn alone is insufficient to differentiate in an international market.

**Pain points:**
- No standalone portfolio to share directly with non-LinkedIn contacts
- No visual representation of project quality and technical breadth
- No personal brand beyond a text résumé

---

## 3. Goals & Success Metrics

### Primary Goal
Position Matheus as a senior-level, internationally competitive engineer through a polished, performant portfolio site.

### Success Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance Score | ≥ 90 |
| Lighthouse Accessibility Score | ≥ 90 |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| First Input Delay (FID) | < 100ms |
| Time to first recruiter contact via site | < 30 days post-launch |

---

## 4. Target Audience

### Primary: International Technical Recruiters
- Screen 50+ profiles per day
- Need to quickly assess seniority and specialization
- Value clean presentation, live demos, and clear role history

### Secondary: Engineering Hiring Managers
- Want to assess technical depth and breadth
- Value open-source contributions, publications, measurable impact
- Review GitHub repos and publication lists

### Tertiary: Peers and Academic Connections
- Interested in research publications and AI/ML projects
- May refer Matheus to opportunities

---

## 5. User Stories

```
US-01: As a recruiter, I want to quickly understand Matheus's specialization and seniority so that I can decide if he fits an open role within 30 seconds.

US-02: As a hiring manager, I want to see concrete technical projects with code so that I can assess skill depth before an interview.

US-03: As a peer, I want to read about Matheus's research publications so that I can reference his work or collaborate.

US-04: As a visitor, I want to contact Matheus directly without filling out a form so that I can reach him quickly.

US-05: As a mobile user, I want the site to be fast and fully functional on small screens so that I can browse it on my phone.
```

---

## 6. Scope

### In Scope (v1.0)
- Single-page portfolio with 6 sections: Hero, About, Experience, Projects, Research, Contact
- Interactive Boids canvas simulation in hero section
- Dark/light theme toggle
- Skills marquee animation
- Smooth scrolling (Lenis)
- Static export deployable to GitHub Pages
- Mobile-responsive layout (375px, 768px, 1280px+)
- Downloadable CV (PDF)
- GitHub Actions CI/CD pipeline

### Out of Scope (v1.0)
- Blog / writing section
- Contact form with backend
- Analytics dashboard
- CMS integration
- Internationalization (i18n)
- Custom domain configuration

### Future Considerations (v2.0)
- Blog section with MDX
- Case studies with detailed write-ups
- Custom domain (e.g., matheus.dev)
- Plausible or Vercel Analytics integration

---

## 7. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Hero section displays name, title, subtitle, location, and status badge | P0 |
| FR-02 | Two hero CTAs: "View Work" (anchor scroll) and "Download CV" (PDF download) | P0 |
| FR-03 | Interactive Boids simulation (80 agents, mouse repulsion, yellow palette) | P0 |
| FR-04 | Sticky header with nav links and theme toggle | P0 |
| FR-05 | Mobile hamburger menu | P0 |
| FR-06 | About section with bio, skills by category, and languages | P0 |
| FR-07 | Skills marquee with 18+ tech terms | P1 |
| FR-08 | Experience timeline (6 roles, most recent first) | P0 |
| FR-09 | Projects grid with 4 cards (GitHub links, live demo where applicable) | P0 |
| FR-10 | Research section with 12+ publication cards (venue badge, year, description) | P0 |
| FR-11 | Contact section with email CTA and LinkedIn link | P0 |
| FR-12 | Footer with copyright, email, GitHub, and LinkedIn | P1 |
| FR-13 | Scroll-triggered fade-up animations on all sections | P1 |
| FR-14 | Dark/light CSS variable theme system | P1 |
| FR-15 | Static export generating `./out` directory | P0 |

---

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | No server required — fully static export |
| NFR-02 | All animations run at 60 fps on mid-range devices |
| NFR-03 | Boids canvas must not block text interaction (pointer-events managed) |
| NFR-04 | Accessible: semantic HTML, focus-visible states, aria-label on icon buttons |
| NFR-05 | No layout shift from font loading (Geist variable font, swap) |
| NFR-06 | All images lazy-loaded |
| NFR-07 | GitHub Actions workflow completes build in < 3 minutes |
