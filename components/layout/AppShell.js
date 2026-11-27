"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Compass, Flame, Home, Moon, Play, Search, Sun, Trophy, User, Zap } from "lucide-react";
import Logo from "./Logo";
import Avatar from "@/components/profile/Avatar";
import { useLearner } from "@/lib/store";
import { getAllCourses } from "@/lib/dataHelpers";

export default function AppShell({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { state, dispatch, level } = useLearner();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");

  const isFocus = pathname.startsWith("/learn") || pathname.startsWith("/quiz");

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!state.toasts.length) return;
    const t = setTimeout(() => {
      dispatch({ type: "DISMISS_TOAST", id: state.toasts[0].id });
    }, 3000);
    return () => clearTimeout(t);
  }, [state.toasts, dispatch]);

  const toggleTheme = () => {
    dispatch({ type: "SET_PROFILE", payload: { theme: state.profile.theme === "dark" ? "light" : "dark" } });
  };

  const resumeSlug = state.enrolledSlugs[0] || "prompt-engineering-fundamentals";
  const resumeLesson = state.lastLessonBySlug[resumeSlug] || "c1-m1-l1";

  const courses = getAllCourses();
  const cmdItems = [
    { label: "Home", href: "/", tag: "Page" },
    { label: "Course Catalogue", href: "/courses", tag: "Page" },
    { label: "Learner Dashboard", href: "/dashboard", tag: "Page" },
    { label: "Leaderboard", href: "/leaderboard", tag: "Page" },
    { label: "Profile & Settings", href: "/profile", tag: "Page" },
    ...courses.map((c) => ({ label: c.title, href: `/courses/${c.slug}`, tag: c.category })),
  ].filter((i) => !cmdQuery.trim() || i.label.toLowerCase().includes(cmdQuery.trim().toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col">
      {!isFocus ? (
        <header className="no-print sticky top-0 z-40 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-raised)]/90 backdrop-blur-md">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
            <Link href={state.profile.onboarded ? "/dashboard" : "/"} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BFF] rounded-2xl">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {[
                { href: "/", label: "Home" },
                { href: "/courses", label: "Courses" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/leaderboard", label: "Leaderboard" },
              ].map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-sm transition ${
                      active ? "font-bold text-[var(--brand-text)] bg-[#5B4BFF]/10" : "font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:border-[#5B4BFF]"
              >
                <Search className="w-3.5 h-3.5" />
                <kbd className="font-mono text-[10px]">Ctrl K</kbd>
              </button>

              <div className="px-2.5 py-1 rounded-full bg-[#FFB020]/15 text-[var(--reward-text)] text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{state.gamification.streak}d</span>
              </div>

              <Link href="/dashboard" className="hidden sm:flex px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-extrabold items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#5B4BFF]" />
                <span>{state.gamification.xp} XP • Lv.{level}</span>
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center"
              >
                {state.profile.theme === "dark" ? <Sun className="w-4 h-4 text-[#FFB020]" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link href="/profile" className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <Avatar name={state.profile.name} config={state.profile.avatar} size={28} level={level} />
                <span className="hidden lg:inline text-xs font-bold max-w-[80px] truncate">{state.profile.name || "Learner"}</span>
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <header className="no-print sticky top-0 z-40 h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-raised)]/95 backdrop-blur-md px-4 flex items-center justify-between">
          <button type="button" onClick={() => router.back()} className="text-xs font-bold flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs font-extrabold">Focus Mode</span>
          <Link href="/dashboard" className="px-3 py-1 rounded-lg border border-[var(--border-subtle)] text-xs font-bold">
            Exit
          </Link>
        </header>
      )}

      <main id="main-content" className="flex-1 pb-24 md:pb-8">{children}</main>

      {!isFocus && (
        <>
          <footer className="no-print hidden lg:block border-t border-[var(--border-subtle)] bg-[var(--bg-raised)] py-10 px-6">
            <div className="max-w-[1280px] mx-auto grid grid-cols-4 gap-8 text-xs">
              <div>
                <div className="font-display font-extrabold text-base mb-2">Learnly</div>
                <p className="text-[var(--text-muted)]">Calm focus + playful reward. Built with Next.js, runs fully in your browser.</p>
              </div>
              <div>
                <div className="font-bold mb-2">Product</div>
                <ul className="space-y-1 text-[var(--text-muted)]">
                  <li><Link href="/courses">Courses</Link></li>
                  <li><Link href="/dashboard">Dashboard</Link></li>
                  <li><Link href="/leaderboard">Leaderboard</Link></li>
                </ul>
              </div>
              <div>
                <div className="font-bold mb-2">Tracks</div>
                <ul className="space-y-1 text-[var(--text-muted)]">
                  <li>AI Engineering</li>
                  <li>Cybersecurity</li>
                  <li>Product Design</li>
                </ul>
              </div>
              <div>
                <div className="font-bold mb-2">Account</div>
                <ul className="space-y-1 text-[var(--text-muted)]">
                  <li><Link href="/onboarding">Onboarding</Link></li>
                  <li><Link href="/profile">Profile & Export</Link></li>
                </ul>
              </div>
            </div>
          </footer>

          <nav className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[var(--bg-raised)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-2 flex items-center justify-around">
            <Link href="/" className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[11px] font-semibold"><Home className="w-5 h-5" /><span>Home</span></Link>
            <Link href="/courses" className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[11px] font-semibold"><Compass className="w-5 h-5" /><span>Courses</span></Link>
            <Link href={`/learn/${resumeSlug}/${resumeLesson}`} className="-mt-5 w-14 h-14 rounded-full bg-[#5B4BFF] text-white shadow-lg flex flex-col items-center justify-center text-[10px] font-bold"><Play className="w-5 h-5" /><span>Learn</span></Link>
            <Link href="/leaderboard" className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[11px] font-semibold"><Trophy className="w-5 h-5" /><span>Ranks</span></Link>
            <Link href="/profile" className="min-w-[48px] min-h-[48px] flex flex-col items-center justify-center text-[11px] font-semibold"><User className="w-5 h-5" /><span>Profile</span></Link>
          </nav>
        </>
      )}

      {cmdOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={(e) => e.target === e.currentTarget && setCmdOpen(false)}>
          <div className="w-full max-w-[560px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border-subtle)]">
              <Search className="w-4 h-4 text-[var(--text-muted)]" />
              <input
                autoFocus
                type="text"
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Jump to any course or page..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px]">Esc</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {cmdItems.map((it) => (
                <button
                  key={it.href + it.label}
                  type="button"
                  onClick={() => { setCmdOpen(false); router.push(it.href); }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[var(--bg-surface)] flex items-center justify-between text-xs font-semibold"
                >
                  <span>{it.label}</span>
                  <span className="text-[11px] text-[var(--brand-text)]">{it.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div aria-live="polite" className="no-print fixed bottom-20 md:bottom-6 right-5 z-50 space-y-2">
        {state.toasts.map((t) => (
          <div key={t.id} className="px-4 py-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-subtle)] shadow-lg text-xs">
            <div className="font-bold">{t.title}</div>
            <div className="text-[var(--text-muted)]">{t.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
