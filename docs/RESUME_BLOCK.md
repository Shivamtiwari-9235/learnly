# Resume & Interview Kit

**One-Line Description:** Built **Learnly**, a browser-native EdTech platform (Next.js 14, Tailwind CSS) featuring distraction-free lessons, a JSON-driven quiz engine, gamified XP/streaks, and printable A4 PDF certificates.

**4 Impact Bullets:**
- Architected a 10-route learning platform with zero-backend `localStorage` persistence (`learnly:v1`), deterministic SVG avatar generation, and instant lesson resume.
- Decoupled gamification, streak calculation, and quiz grading into pure, Node-tested `/lib` modules preventing double-XP and timezone edge-case bugs.
- Engineered an accessible UI with WCAG AA light/dark contrast, `Ctrl+K` command palette, `aria-live` quiz timers, and `48px` mobile bottom-nav tap targets.
- Designed a print-first A4 landscape certificate (`@page` + `@media print`) unlocked strictly at 100% lesson completion and 70%+ quiz mastery.

**30-Second Interview Pitch:**
"I built Learnly to feel like a shipped EdTech product rather than a tutorial. A learner can onboard with a deterministic SVG avatar, discover courses, study in a paper-toned focus player with auto-saved notes, pass a timed quiz, earn XP and badges, and export a print-ready A4 PDF certificate—all running 100% client-side with pure, unit-tested business logic."
