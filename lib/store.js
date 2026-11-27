"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { safeGetStorage, safeResetStorage, safeSetStorage } from "./storage";
import { generateAvatarConfig } from "./avatar";
import { BADGE_DEFS, levelFromXP, levelTitle, localDateKey, updateStreak } from "./xp";
import { getAllCourses, getTotalLessons } from "./dataHelpers";

const StoreContext = createContext(null);

function createInitialState() {
  return {
    version: 1,
    hydrated: false,
    profile: {
      name: "Learner",
      interests: ["AI Engineering"],
      dailyGoal: 20,
      avatar: generateAvatarConfig("Learner", 1),
      onboarded: false,
      theme: "light",
      createdAt: new Date().toISOString(),
    },
    enrolledSlugs: [],
    completedLessons: {},
    lastLessonBySlug: {},
    bookmarks: [],
    notes: {},
    quizResults: {},
    certificates: {},
    gamification: {
      xp: 0,
      streak: 1,
      longestStreak: 1,
      lastActiveDate: null,
      badges: [],
      xpHistory: [],
    },
    toasts: [],
  };
}

function evaluateBadges(state) {
  const courses = getAllCourses();
  const totalCompletedLessons = Object.values(state.completedLessons).reduce((s, arr) => s + arr.length, 0);
  const passedQuizzesCount = Object.values(state.quizResults).filter((r) => r.passed).length;
  const perfectQuizzesCount = Object.values(state.quizResults).filter((r) => r.bestScore === 100).length;
  const enrolledCats = new Set(
    state.enrolledSlugs.map((slug) => courses.find((c) => c.slug === slug)?.category).filter(Boolean)
  );
  const ctx = {
    totalCompletedLessons,
    enrolledSlugs: state.enrolledSlugs,
    passedQuizzesCount,
    perfectQuizzesCount,
    streak: state.gamification.streak,
    xp: state.gamification.xp,
    certificatesCount: Object.keys(state.certificates).length,
    enrolledCategoriesCount: enrolledCats.size,
  };
  const newBadges = [...state.gamification.badges];
  for (const b of BADGE_DEFS) {
    if (!newBadges.includes(b.id) && b.rule(ctx)) {
      newBadges.push(b.id);
    }
  }
  return newBadges;
}

function awardXPAndStreak(state, amount, reason) {
  const today = localDateKey();
  const st = updateStreak(state.gamification.streak, state.gamification.longestStreak, state.gamification.lastActiveDate, today);
  const streakBonus = st.isNewDay ? 5 * Math.min(st.streak, 7) : 0;
  const totalGain = amount + streakBonus;
  const nextXP = state.gamification.xp + totalGain;
  const historyItem = { id: `${Date.now()}-${Math.random()}`, amount: totalGain, reason, timestamp: today };
  const toastItem = { id: historyItem.id, title: `+${totalGain} XP`, subtitle: reason };
  return {
    ...state,
    gamification: {
      ...state.gamification,
      xp: nextXP,
      streak: st.streak,
      longestStreak: st.longestStreak,
      lastActiveDate: today,
      xpHistory: [historyItem, ...state.gamification.xpHistory].slice(0, 25),
    },
    toasts: [...state.toasts, toastItem].slice(-3),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };
    case "SET_PROFILE": {
      const next = { ...state, profile: { ...state.profile, ...action.payload } };
      return next;
    }
    case "ENROLL": {
      const { slug } = action;
      if (state.enrolledSlugs.includes(slug)) return state;
      let next = { ...state, enrolledSlugs: [...state.enrolledSlugs, slug] };
      next = awardXPAndStreak(next, 10, "Enrolled in course");
      next.gamification.badges = evaluateBadges(next);
      return next;
    }
    case "SET_LAST_LESSON": {
      const { slug, lessonId } = action;
      return { ...state, lastLessonBySlug: { ...state.lastLessonBySlug, [slug]: lessonId } };
    }
    case "COMPLETE_LESSON": {
      const { slug, lessonId } = action;
      const existing = state.completedLessons[slug] || [];
      if (existing.includes(lessonId)) return state;
      let next = {
        ...state,
        enrolledSlugs: state.enrolledSlugs.includes(slug) ? state.enrolledSlugs : [...state.enrolledSlugs, slug],
        completedLessons: { ...state.completedLessons, [slug]: [...existing, lessonId] },
        lastLessonBySlug: { ...state.lastLessonBySlug, [slug]: lessonId },
      };
      next = awardXPAndStreak(next, 20, "Completed lesson");
      next.gamification.badges = evaluateBadges(next);
      return next;
    }
    case "TOGGLE_BOOKMARK": {
      const { lessonId } = action;
      const exists = state.bookmarks.includes(lessonId);
      const bookmarks = exists ? state.bookmarks.filter((id) => id !== lessonId) : [...state.bookmarks, lessonId];
      return { ...state, bookmarks };
    }
    case "SAVE_NOTE": {
      const { lessonId, text } = action;
      return { ...state, notes: { ...state.notes, [lessonId]: text } };
    }
    case "SAVE_QUIZ_ATTEMPT": {
      const { course, percent, passed, correctCount } = action;
      const prev = state.quizResults[course.slug];
      const isFirst = !prev;
      const bestScore = prev ? Math.max(prev.bestScore, percent) : percent;
      let xpGain = isFirst ? correctCount * 10 : 0;
      if (passed && !prev?.passed) xpGain += 50 + (isFirst ? 30 : 0);

      let next = {
        ...state,
        quizResults: {
          ...state.quizResults,
          [course.slug]: {
            bestScore,
            passed: Boolean(prev?.passed || passed),
            attempts: (prev?.attempts || 0) + 1,
            lastAttemptAt: localDateKey(),
          },
        },
      };
      if (xpGain > 0) next = awardXPAndStreak(next, xpGain, passed ? `Passed ${course.title} quiz` : "First quiz attempt");

      const doneCount = (next.completedLessons[course.slug] || []).length;
      if (next.quizResults[course.slug].passed && doneCount >= getTotalLessons(course) && !next.certificates[course.slug]) {
        const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const certId = `LRN-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        next.certificates = { ...next.certificates, [course.slug]: { certId, issuedAt: issueDate, scorePct: bestScore } };
        next = awardXPAndStreak(next, 150, `Certificate unlocked for ${course.title}`);
      }
      next.gamification.badges = evaluateBadges(next);
      return next;
    }
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "RESET_ALL":
      safeResetStorage();
      return { ...createInitialState(), hydrated: true };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    const saved = safeGetStorage(null);
    if (saved) {
      dispatch({ type: "HYDRATE", payload: saved });
    } else {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { toasts, hydrated, ...persistable } = state;
    safeSetStorage(persistable);
    document.documentElement.classList.toggle("dark", state.profile.theme === "dark");
  }, [state]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useLearner() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useLearner must be used inside StoreProvider");
  const { state, dispatch } = ctx;
  const level = levelFromXP(state.gamification.xp);
  return { state, dispatch, level, levelTitle: levelTitle(level) };
}
