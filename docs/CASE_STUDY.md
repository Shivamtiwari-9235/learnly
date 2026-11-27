# Case Study: Designing & Building Learnly

## Problem
Many self-directed learners bounce off bloated MOOCs behind paywalls and login gates, while portfolio tutorial projects rarely feel like cohesive, shipped EdTech products.

## Users & Goals
Built for developers and designers learning AI Engineering, Cybersecurity, and Product Design who want fast discovery, calm reading, instant knowledge checks, and a tangible certificate deliverable.

## Key Architectural Decisions & Trade-Offs
- **Zero-Backend `localStorage` (`learnly:v1`)**: Eliminates auth friction so visitors start learning in 10 seconds, at the trade-off of local-only certificate verification.
- **Pure Business Logic in `/lib`**: Separated `xp.js`, `quiz.js`, `avatar.js`, and `certificate.js` from React UI so every rule is unit-tested via Node `assert`.
- **Accessibility First**: Enforced WCAG AA pairs (fixing `#FFB020` on white to `#B45F00`), non-color-only quiz states, `48px` mobile tap targets, and `prefers-reduced-motion` support.

## Results & Next Steps
Shipped 10 responsive routes, 6 courses, 10 rarity badges, and A4 landscape print-to-PDF certificates. Next: optional cloud sync and custom course import/export.
