"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, BookOpen, CheckCircle2, Clock, Play } from "lucide-react";
import { flattenLessons } from "@/lib/dataHelpers";
import { useLearner } from "@/lib/store";

export default function CourseDetailClient({ course }) {
  const router = useRouter();
  const { state, dispatch } = useLearner();
  const flat = flattenLessons(course);
  const completedIds = state.completedLessons[course.slug] || [];
  const enrolled = state.enrolledSlugs.includes(course.slug);
  const pct = flat.length ? Math.round((completedIds.length / flat.length) * 100) : 0;
  const nextLesson = flat.find((l) => !completedIds.includes(l.id)) || flat[0];
  const hasCert = Boolean(state.certificates[course.slug]);

  const handleEnroll = () => {
    if (!enrolled) dispatch({ type: "ENROLL", slug: course.slug });
    router.push(`/learn/${course.slug}/${state.lastLessonBySlug[course.slug] || flat[0].id}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link href="/courses" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]">
        ← Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden">
            <img src={course.coverImage} alt={course.title} className="w-full h-56 sm:h-64 object-cover" />
            <div className="p-6 space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: course.accentColor }}>{course.category}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-[var(--border-subtle)]">{course.level}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{course.title}</h1>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{course.subtitle}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 space-y-3">
            <h2 className="text-lg font-extrabold">What you will learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 space-y-3">
            <h2 className="text-lg font-extrabold">Syllabus ({course.modules.length} modules • {flat.length} lessons)</h2>
            {course.modules.map((m, idx) => (
              <details key={m.id} open={idx === 0} className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                <summary className="cursor-pointer px-4 py-3 bg-[var(--bg-surface)] font-bold text-sm flex justify-between">
                  <span>{m.title}</span>
                  <span className="text-xs text-[var(--text-muted)]">{m.lessons.length} lessons</span>
                </summary>
                <div className="divide-y divide-[var(--border-subtle)]">
                  {m.lessons.map((l) => {
                    const done = completedIds.includes(l.id);
                    return (
                      <Link key={l.id} href={`/learn/${course.slug}/${l.id}`} className="px-4 py-3 flex items-center justify-between text-xs sm:text-sm hover:bg-[var(--bg-surface)]">
                        <span className="flex items-center gap-2">
                          {done ? <CheckCircle2 className="w-4 h-4 text-[#12B76A]" /> : <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />}
                          <span>{l.title}</span>
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{l.durationMin}m</span>
                      </Link>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 space-y-4 shadow-sm">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Instructor</span>
              <span className="font-bold">{course.instructor.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Duration</span>
              <span className="font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.durationHours}h</span>
            </div>
            {enrolled && (
              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex justify-between text-xs font-bold"><span>Progress</span><span>{pct}%</span></div>
                <div className="h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden"><div className="h-full bg-[#5B4BFF] rounded-full" style={{ width: `${pct}%` }} /></div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">Next: {nextLesson.title}</div>
              </div>
            )}
            <button type="button" onClick={handleEnroll} className="w-full py-3 rounded-xl bg-[#5B4BFF] hover:bg-[#4A3BE0] text-white text-sm font-bold flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              <span>{enrolled ? "Continue learning" : "Enroll for free (+10 XP)"}</span>
            </button>
            <Link href={`/quiz/${course.slug}`} className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold flex items-center justify-center">
              Take 5-Question Quiz
            </Link>
            {hasCert && (
              <Link href={`/certificate/${course.slug}`} className="w-full py-2.5 rounded-xl bg-[#12B76A] text-white text-xs font-bold flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4" /> View Certificate
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
