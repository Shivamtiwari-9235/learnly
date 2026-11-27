"use client";

import Link from "next/link";
import { Award, Flame, Zap } from "lucide-react";
import { getAllCourses, getTotalLessons } from "@/lib/dataHelpers";
import { useLearner } from "@/lib/store";
import { BADGE_DEFS, progressToNextLevel } from "@/lib/xp";
import Avatar from "@/components/profile/Avatar";

export default function DashboardPage() {
  const { state, level, levelTitle } = useLearner();
  const courses = getAllCourses();
  const enrolledCourses = courses.filter((c) => state.enrolledSlugs.includes(c.slug));
  const prog = progressToNextLevel(state.gamification.xp);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={state.profile.name} config={state.profile.avatar} size={64} level={level} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, {state.profile.name}</h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">Lv.{level} {levelTitle} • {state.gamification.streak}-day streak</p>
          </div>
        </div>
        <Link href="/courses" className="px-4 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">Explore Courses</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-1">
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[#5B4BFF]" /> Total XP</div>
          <div className="text-2xl font-extrabold text-[var(--brand-text)]">{state.gamification.xp} XP</div>
          <div className="h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden"><div className="h-full bg-[#5B4BFF]" style={{ width: `${prog.percent}%` }} /></div>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-1">
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-[#FFB020]" /> Streak</div>
          <div className="text-2xl font-extrabold text-[var(--reward-text)]">{state.gamification.streak}d</div>
          <div className="text-xs text-[var(--text-muted)]">Best: {state.gamification.longestStreak}d</div>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-1">
          <div className="text-xs text-[var(--text-muted)]">Badges</div>
          <div className="text-2xl font-extrabold">{state.gamification.badges.length} / {BADGE_DEFS.length}</div>
        </div>
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-1">
          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Award className="w-3.5 h-3.5 text-[#12B76A]" /> Certificates</div>
          <div className="text-2xl font-extrabold text-[#12B76A]">{Object.keys(state.certificates).length}</div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-extrabold">Continue Learning</h2>
        {enrolledCourses.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map((c) => {
              const total = getTotalLessons(c);
              const done = (state.completedLessons[c.slug] || []).length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              const resumeId = state.lastLessonBySlug[c.slug] || c.modules[0].lessons[0].id;
              return (
                <div key={c.slug} className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[var(--brand-text)]">{pct}% • {done}/{total} lessons</div>
                    <div className="font-bold text-base">{c.title}</div>
                  </div>
                  <Link href={`/learn/${c.slug}/${resumeId}`} className="px-4 py-2 rounded-xl bg-[#14142B] dark:bg-white text-white dark:text-[#14142B] text-xs font-bold shrink-0">
                    Resume
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-dashed border-[var(--border-subtle)] text-center space-y-3">
            <p className="text-sm text-[var(--text-muted)]">You have not enrolled in any courses yet.</p>
            <Link href="/courses" className="inline-block px-4 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">Browse Catalogue</Link>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-extrabold">Achievements & Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGE_DEFS.map((b) => {
            const unlocked = state.gamification.badges.includes(b.id);
            return (
              <div key={b.id} className={`p-4 rounded-2xl border ${unlocked ? "border-[#FFB020] bg-[#FFB020]/10" : "border-[var(--border-subtle)] bg-[var(--bg-raised)] opacity-50"}`}>
                <div className="text-[10px] uppercase font-bold text-[var(--brand-text)]">{b.rarity}</div>
                <div className="font-bold text-xs mt-1">{b.title}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
