# Accessibility Statement (WCAG 2.1 AA Compliance)
## AirWise AI – Urban Air Quality Assistant

**AirWise AI** is designed to be accessible to all users, including individuals with visual, motor, or cognitive impairments. We target and adhere to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.

---

## ♿ Accessibility Implementations

### 1. Semantic Structure & Landmark Roles
- Built with semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- Navigation tabs utilize explicit `role="tab"` and `aria-selected` attributes for assistive technologies.
- Dialogs (e.g. Onboarding and Action Logger) enforce `role="dialog"` and `aria-modal="true"`.

### 2. High-Contrast Color System & Color-Blind Friendliness
- AQI categories do not rely solely on color; every metric is paired with **numerical AQI values**, **text labels** (e.g. *Good*, *Moderate*, *Severe*), and **text descriptions**.
- Color combinations satisfy the **WCAG AA contrast ratio of at least 4.5:1** for normal text and 3:1 for large graphical elements.

### 3. Keyboard Navigation & Focus Indicators
- All interactive controls (buttons, links, search dropdowns, sliders, tabs) are fully accessible via `Tab`, `Shift + Tab`, `Enter`, and `Space`.
- Prominent focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-500`) provide unambiguous visual indication of active focus.

### 4. Screen Reader Support & Live Regions
- Alert ribbons and severe smog banners utilize `aria-live="polite"` to notify screen reader users when atmospheric risk thresholds are crossed.
- Graphical charts (Recharts) feature text equivalents, clear titles, and structured tabular summaries for non-visual consumption.

### 5. Responsive Font Scaling & Reduced Motion
- Uses scalable root `rem`/`em` typography supporting up to 200% browser zoom without clipping or horizontal overflow.
- Respects user operating system preferences for `prefers-reduced-motion`.
