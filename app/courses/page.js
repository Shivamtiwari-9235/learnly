"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Award, CheckCircle2, Clock, Search } from "lucide-react";
import { getAllCourses, getTotalLessons } from "@/lib/dataHelpers";
import { useLearner } from "@/lib/store";

export default function CoursesPage() {
  const courses = getAllCourses();
  const { state } = useLearner();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => {
        const mQ = !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.instructor.name.toLowerCase().includes(q);
        const mC = category === "All" || c.category === category;
        const mL = level === "All" || c.level === level;
        return mQ && mC && mL;
      })
      .sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "shortest") return a.durationHours - b.durationHours;
        return b.learnersCount - a.learnersCount;
      });
  }, [courses, query, category, level, sort]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Course Catalogue</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">6 hands-on courses across AI Engineering, Cybersecurity, and Product Design.</p>
        </div>
        <div aria-live="polite" className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--bg-raised)] border border-[var(--border-subtle)]">
          Showing {filtered.length} of {courses.length} courses
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, instructors, or topics..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] text-sm"
          />
        </div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-10 px-3 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold">
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 px-3 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold">
          <option value="popular">Sort: Popular</option>
          <option value="rating">Sort: Highest rated</option>
          <option value="shortest">Sort: Shortest</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "AI Engineering", "Cybersecurity", "Product Design"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
              category === cat ? "bg-[#5B4BFF] text-white" : "bg-[var(--bg-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const total = getTotalLessons(c);
            const done = (state.completedLessons[c.slug] || []).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const hasCert = Boolean(state.certificates[c.slug]);
            return (
              <Link key={c.slug} href={`/courses/${c.slug}`} className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] overflow-hidden hover:border-[#5B4BFF] transition flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-[#14142B]">{c.category}</span>
                  {hasCert && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#12B76A] text-white flex items-center gap-1">
                      <Award className="w-3 h-3" /> Certified
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--reward-text)]">★ {c.rating}</span>
                    <span className="text-[var(--text-muted)]">{c.level}</span>
                  </div>
                  <h2 className="font-bold text-base mb-1">{c.title}</h2>
                  <p className="text-xs text-[var(--text-muted)] mb-4 flex-1">{c.subtitle}</p>
                  {done > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[var(--brand-text)] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {pct}%</span>
                        <span>{done}/{total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                        <div className="h-full bg-[#5B4BFF] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between text-xs text-[var(--text-muted)]">
                    <span>{c.instructor.name}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.durationHours}h • {total} lessons</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-raised)] p-12 text-center max-w-md mx-auto space-y-3">
          <h2 className="text-lg font-extrabold">No matching courses</h2>
          <p className="text-xs text-[var(--text-muted)]">Clear your search or filter selections to see all 6 courses.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("All"); setLevel("All"); }} className="px-4 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
