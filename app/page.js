"use client";

import Link from "next/link";
import { ArrowRight, Award, BookOpen, CheckCircle2, Cpu, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { useLearner } from "@/lib/store";
import { getAllCourses } from "@/lib/dataHelpers";
import { recommendCourses } from "@/lib/recommend";

export default function LandingPage() {
  const { state } = useLearner();
  const courses = getAllCourses();
  const featured = recommendCourses(courses, state.profile.interests).slice(0, 3);
  const hasProgress = state.enrolledSlugs.length > 0;

  return (
    <div className="space-y-16 lg:space-y-24 py-10 px-4 sm:px-6 max-w-[1200px] mx-auto">
      <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-sm">
        <div className="lg:col-span-7 space-y-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B4BFF]/10 text-[var(--brand-text)] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Mastery-First Learning • Runs 100% in Browser
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Master AI, Security & Design — one focused lesson at a time.
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-xl leading-relaxed">
            Enroll in hands-on courses with deep written study notes, test your mastery with 5-question quizzes, earn XP, and export printable A4 certificates.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={hasProgress ? "/dashboard" : "/onboarding"}
              className="h-12 px-6 rounded-xl bg-[#5B4BFF] hover:bg-[#4A3BE0] text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#5B4BFF]/20"
            >
              <span>{hasProgress ? "Continue learning" : "Get started free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/courses" className="h-12 px-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm font-bold flex items-center">
              Browse all 6 courses
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-1">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A]" /> 90 written-note lessons</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A]" /> Instant-feedback quizzes</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A]" /> A4 print-to-PDF certificates</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
            <div className="text-xs font-bold text-[#7C5CFF]">AI Engineering • Beginner</div>
            <div className="font-bold text-base">Prompt Engineering Fundamentals</div>
            <div className="text-xs text-[var(--text-muted)]">15 structured study-note lessons + 5-question mastery quiz</div>
          </div>
          <div className="p-5 rounded-2xl border border-[#12B76A]/40 bg-[#12B76A]/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#12B76A]">Sequential Mastery Gate</div>
              <div className="text-xs text-[var(--text-muted)]">Tick each lesson complete to unlock Next & Certificate</div>
            </div>
            <Award className="w-7 h-7 text-[#12B76A] shrink-0" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-2">
          <Cpu className="w-6 h-6 text-[#7C5CFF]" />
          <h2 className="text-lg font-bold">AI Engineering</h2>
          <p className="text-xs text-[var(--text-muted)]">Structured prompting, LLM APIs, streaming SSE, and tool calling.</p>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#14B8A6]" />
          <h2 className="text-lg font-bold">Cybersecurity</h2>
          <p className="text-xs text-[var(--text-muted)]">OWASP Top 10, XSS/SQLi defense, Argon2id, and Zero Trust IAM.</p>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] space-y-2">
          <Palette className="w-6 h-6 text-[#FF6B5E]" />
          <h2 className="text-lg font-bold">Product Design</h2>
          <p className="text-xs text-[var(--text-muted)]">Semantic design tokens, WCAG AA contrast, and accessible UX.</p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">{state.profile.onboarded ? "Recommended for You" : "Featured Courses"}</h2>
          <Link href="/courses" className="text-xs font-bold text-[var(--brand-text)]">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((c) => (
            <Link key={c.id} href={`/courses/${c.slug}`} className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden hover:border-[#5B4BFF] transition flex flex-col">
              <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[11px] font-bold mb-1" style={{ color: c.accentColor }}>{c.category} • {c.level}</span>
                <h3 className="font-bold text-base mb-1">{c.title}</h3>
                <p className="text-xs text-[var(--text-muted)] flex-1">{c.subtitle}</p>
                <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex justify-between">
                  <span>{c.instructor.name}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 15 lessons</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
