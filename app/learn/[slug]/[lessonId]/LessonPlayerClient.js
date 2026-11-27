"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, BookOpen, Check, CheckCircle2, Lock } from "lucide-react";
import { flattenLessons, getNextLesson, getPrevLesson } from "@/lib/dataHelpers";
import { useLearner } from "@/lib/store";

export default function LessonPlayerClient({ course, lesson, lessonIndex }) {
  const { state, dispatch } = useLearner();
  const [fontSize, setFontSize] = useState(17);
  const [copied, setCopied] = useState(false);

  const flat = flattenLessons(course);
  const completedIds = state.completedLessons[course.slug] || [];
  const isDone = completedIds.includes(lesson.id);
  const isBookmarked = state.bookmarks.includes(lesson.id);
  const prev = getPrevLesson(course, lesson.id);
  const next = getNextLesson(course, lesson.id);

  useEffect(() => {
    dispatch({ type: "SET_LAST_LESSON", slug: course.slug, lessonId: lesson.id });
  }, [course.slug, lesson.id, dispatch]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(lesson.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[var(--paper-bg)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-4 h-fit space-y-4">
          <div className="text-xs font-bold uppercase text-[var(--text-muted)]">{course.title}</div>
          {course.modules.map((m) => (
            <div key={m.id} className="space-y-1">
              <div className="text-xs font-bold">{m.title}</div>
              {m.lessons.map((l) => {
                const active = l.id === lesson.id;
                const done = completedIds.includes(l.id);
                return (
                  <Link
                    key={l.id}
                    href={`/learn/${course.slug}/${l.id}`}
                    className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                      active ? "bg-[#5B4BFF] text-white font-bold" : "hover:bg-[var(--paper-bg)] text-[var(--text-muted)]"
                    }`}
                  >
                    {done ? <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${active ? "text-white" : "text-[#12B76A]"}`} /> : <span className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />}
                    <span className="truncate">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        <section className="lg:col-span-8 max-w-[720px] space-y-6">
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--brand-text)]">Lesson {lessonIndex + 1} of {flat.length} • {lesson.durationMin} min read</span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setFontSize((f) => Math.max(15, f - 1))} className="px-2 py-1 rounded-lg border border-[var(--border-subtle)] text-xs font-bold">A-</button>
                <button type="button" onClick={() => setFontSize((f) => Math.min(21, f + 1))} className="px-2 py-1 rounded-lg border border-[var(--border-subtle)] text-xs font-bold">A+</button>
                <button type="button" onClick={() => dispatch({ type: "TOGGLE_BOOKMARK", lessonId: lesson.id })} className="p-2 rounded-lg border border-[var(--border-subtle)]" aria-label="Bookmark lesson">
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#FFB020] text-[#FFB020]" : ""}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold">{lesson.title}</h1>

            <div className="rounded-2xl bg-[#5B4BFF]/5 border border-[#5B4BFF]/20 p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--brand-text)] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Study Notes & Deep Dive
              </div>
              <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }} className="max-w-[68ch]">{lesson.body}</p>
              <p style={{ fontSize: `${fontSize - 1}px`, lineHeight: 1.65 }} className="max-w-[68ch] text-[var(--text-muted)] pt-2 border-t border-[#5B4BFF]/15">{lesson.deepDive}</p>
              <div className="p-3 rounded-xl bg-[var(--bg-raised)] border border-[#12B76A]/40 text-xs sm:text-sm">
                <strong>Key Takeaway:</strong> {lesson.takeaway}
              </div>
            </div>

            {lesson.code && (
              <div className="rounded-2xl overflow-hidden bg-[#0F172A] text-slate-100 border border-slate-800">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between text-xs">
                  <span className="font-mono text-slate-400">{lesson.language}</span>
                  <button type="button" onClick={handleCopy} className="font-bold text-[#8F85FF]">{copied ? "Copied!" : "Copy"}</button>
                </div>
                <pre className="p-4 font-mono text-xs sm:text-sm overflow-x-auto">{lesson.code}</pre>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {prev && (
                  <Link href={`/learn/${course.slug}/${prev.id}`} className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold">
                    ← Previous
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "COMPLETE_LESSON", slug: course.slug, lessonId: lesson.id })}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isDone ? "bg-[#12B76A]/15 text-[#12B76A] border border-[#12B76A]/40" : "bg-[#5B4BFF] text-white"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  <span>{isDone ? "Completed" : "Mark Complete (+20 XP)"}</span>
                </button>
              </div>

              {next ? (
                isDone ? (
                  <Link href={`/learn/${course.slug}/${next.id}`} className="px-5 py-2.5 rounded-xl bg-[#14142B] dark:bg-white text-white dark:text-[#14142B] text-xs font-bold">
                    Next Lesson →
                  </Link>
                ) : (
                  <span className="px-4 py-2.5 rounded-xl bg-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Complete to unlock Next
                  </span>
                )
              ) : isDone ? (
                <Link href={`/quiz/${course.slug}`} className="px-5 py-2.5 rounded-xl bg-[#FFB020] text-[#14142B] text-xs font-extrabold">
                  Take Final Quiz →
                </Link>
              ) : (
                <span className="px-4 py-2.5 rounded-xl bg-[var(--border-subtle)] text-[var(--text-muted)] text-xs font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Complete to unlock Quiz
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-5 space-y-2">
            <label className="block text-xs font-bold">Personal Lesson Notes (auto-saved)</label>
            <textarea
              rows={3}
              value={state.notes[lesson.id] || ""}
              onChange={(e) => dispatch({ type: "SAVE_NOTE", lessonId: lesson.id, text: e.target.value })}
              placeholder="Write your notes or key commands..."
              className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
