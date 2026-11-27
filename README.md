# Learnly — Mastery-First Mini Learning Platform

> **Calm focus + playful reward.** A portfolio-grade, browser-native EdTech platform built with Next.js 14 (App Router, JavaScript + JSDoc), Tailwind CSS design tokens, and `localStorage` persistence.

## Features
- **Discovery & Onboarding:** 4-step personalized onboarding with interest chips, daily goals, and deterministic SVG avatar creation.
- **Course Catalogue & Detail:** Debounced search, category tabs, level/sort filters, URL-synced query params, outcomes, and expandable syllabus accordions.
- **Distraction-Free Lesson Player:** Calm paper reading mode, collapsible 320px sidebar / mobile drawer, dark-slate code blocks with copy feedback, personal notes, bookmarks, `A-`/`A+` font sizing, and automatic resume.
- **Mastery Quiz Engine:** Pure scoring logic (`/lib/quiz.js`), optional countdown timer with `aria-live` announcements, non-color-only option states, instant explanations, and reshuffled retries.
- **Gamification & Leaderboard:** Deterministic XP, level rings, timezone-safe daily streaks, 10 rarity badges, and a 24-peer community leaderboard.
- **A4 Printable Certificate:** Unlocks on 100% lesson completion + 70%+ quiz score; ivory/navy/gold A4 landscape `@media print` layout with deterministic local ID (`LRN-2026-XXXXXX`).

## Architecture & Data Flow
```mermaid
flowchart LR
  UI[Pages & Components] --> Store[React Context + useReducer]
  Store --> XP[Pure Logic: /lib/xp.js, /lib/quiz.js, /lib/certificate.js]
  Store --> LS[(localStorage learnly:v1)]
  Data[/data/courses & /data/learners] --> UI
```

## Page Map (10 Routes)
| Route | Mood | Focus |
| --- | --- | --- |
| `/` | Inspiring, energetic | Hook, interactive showcase, CTA |
| `/onboarding` | Welcoming | Name, interests, daily goal, SVG avatar |
| `/courses` | Clean, scannable | Search, category/level/sort filters |
| `/courses/[slug]` | Persuasive | Outcomes, syllabus, sticky enroll |
| `/learn/[slug]/[lessonId]` | Calm paper | Focus mode, code, notes, resume |
| `/quiz/[slug]` | Focused | Timer, non-color feedback, retry |
| `/dashboard` | Motivating | Progress rings, XP chart, heatmap, badges |
| `/certificate/[slug]` | Prestigious | Ivory/navy/gold A4 PDF print |
| `/leaderboard` | Competitive | Podium, weekly/all-time, Next Target |
| `/profile` | Personal | 160px avatar editor, badges, export/reset |

## Local Run & Deploy
```bash
npm install
npm run dev      # http://localhost:3000
npm run test:logic
npm run build    # Static export to /out for Vercel or Netlify
```
*Note: Certificates use deterministic local IDs (`LRN-2026-XXXXXX`) for portfolio demonstration; there is no backend verification server.*
