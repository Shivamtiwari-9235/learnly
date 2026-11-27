export const LEVEL_TITLES = [
  "Curious Cub",
  "Explorer",
  "Practitioner",
  "Specialist",
  "Expert",
  "Master",
  "Legend",
];

export function levelFromXP(xp) {
  return Math.floor(Math.sqrt((xp || 0) / 60)) + 1;
}

export function xpForLevel(n) {
  return Math.pow(Math.max(1, n) - 1, 2) * 60;
}

export function levelTitle(n) {
  return LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.max(0, n - 1))];
}

export function progressToNextLevel(xp) {
  const level = levelFromXP(xp);
  const curFloor = xpForLevel(level);
  const nextFloor = xpForLevel(level + 1);
  const span = Math.max(1, nextFloor - curFloor);
  return {
    level,
    title: levelTitle(level),
    currentInLevel: xp - curFloor,
    neededForNext: span,
    percent: Math.min(100, Math.round(((xp - curFloor) / span) * 100)),
  };
}

export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function updateStreak(prevStreak, longestStreak, lastDate, todayDate) {
  if (!lastDate) return { streak: 1, longestStreak: Math.max(1, longestStreak), isNewDay: true };
  if (lastDate === todayDate) return { streak: prevStreak, longestStreak, isNewDay: false };
  const [y1, m1, d1] = lastDate.split("-").map(Number);
  const [y2, m2, d2] = todayDate.split("-").map(Number);
  const diffDays = Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000);
  const next = diffDays === 1 ? prevStreak + 1 : 1;
  return { streak: next, longestStreak: Math.max(longestStreak, next), isNewDay: true };
}

export const BADGE_DEFS = [
  { id: "first-steps", title: "First Steps", rarity: "common", icon: "footprints", desc: "Complete your first lesson", rule: (s) => s.totalCompletedLessons >= 1 },
  { id: "enrolled", title: "Enrolled", rarity: "common", icon: "book-open", desc: "Enroll in a course", rule: (s) => s.enrolledSlugs.length >= 1 },
  { id: "quiz-whiz", title: "Quiz Whiz", rarity: "rare", icon: "check-circle-2", desc: "Pass any course quiz", rule: (s) => s.passedQuizzesCount >= 1 },
  { id: "perfect-score", title: "Perfect Score", rarity: "epic", icon: "sparkles", desc: "Score 100% on a quiz", rule: (s) => s.perfectQuizzesCount >= 1 },
  { id: "streak-3", title: "Streak 3", rarity: "common", icon: "flame", desc: "Reach a 3-day streak", rule: (s) => s.streak >= 3 },
  { id: "streak-7", title: "Streak 7", rarity: "rare", icon: "flame", desc: "Reach a 7-day streak", rule: (s) => s.streak >= 7 },
  { id: "level-3", title: "Level 3", rarity: "rare", icon: "shield", desc: "Reach Practitioner (Lv.3)", rule: (s) => levelFromXP(s.xp) >= 3 },
  { id: "level-5", title: "Level 5", rarity: "epic", icon: "crown", desc: "Reach Expert (Lv.5)", rule: (s) => levelFromXP(s.xp) >= 5 },
  { id: "course-finisher", title: "Course Finisher", rarity: "epic", icon: "award", desc: "Unlock a course certificate", rule: (s) => s.certificatesCount >= 1 },
  { id: "polymath", title: "Polymath", rarity: "rare", icon: "layers", desc: "Enroll in 2+ categories", rule: (s) => s.enrolledCategoriesCount >= 2 },
];
