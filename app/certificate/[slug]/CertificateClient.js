"use client";

import Link from "next/link";
import { Lock, Printer } from "lucide-react";
import { getTotalLessons } from "@/lib/dataHelpers";
import { getCertificateEligibility } from "@/lib/certificate";
import { useLearner } from "@/lib/store";
import Logo from "@/components/layout/Logo";

export default function CertificateClient({ course }) {
  const { state } = useLearner();
  const totalLessons = getTotalLessons(course);
  const completedLessons = (state.completedLessons[course.slug] || []).length;
  const quizRec = state.quizResults[course.slug];
  const cert = state.certificates[course.slug];
  const elig = getCertificateEligibility({
    completedLessons,
    totalLessons,
    bestQuizScore: quizRec?.bestScore ?? null,
    passingScore: course.quiz.passingScore,
  });

  if (!elig.eligible || !cert) {
    return (
      <div className="max-w-lg mx-auto my-14 p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] text-center space-y-4">
        <Lock className="w-10 h-10 mx-auto text-[#FFB020]" />
        <h1 className="text-2xl font-extrabold">Certificate Locked</h1>
        <div className="space-y-2 text-left text-xs">
          {elig.missing.map((m) => (
            <div key={m} className="p-3 rounded-xl bg-[#F04438]/10 border border-[#F04438]/30 text-[#F04438] font-bold">{m}</div>
          ))}
        </div>
        <Link href={`/courses/${course.slug}`} className="inline-block px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">
          Return to Course
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold">Verified Certificate</h1>
        <button type="button" onClick={() => window.print()} className="px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold flex items-center gap-2">
          <Printer className="w-4 h-4" /> Download A4 PDF
        </button>
      </div>

      <div id="print-certificate" className="relative mx-auto w-full aspect-[297/210] bg-[#FFFDF6] text-[#1B1F4B] rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col justify-between border-[12px] border-[#1B1F4B] overflow-hidden">
        <div className="absolute inset-3 border-2 border-[#B88A1B] pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <Logo />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-[#B88A1B] font-bold">Certificate ID</div>
            <div className="font-mono text-xs font-bold">{cert.certId}</div>
          </div>
        </div>
        <div className="relative z-10 text-center my-auto py-4">
          <div className="text-xs uppercase tracking-[0.28em] text-[#B88A1B] font-bold mb-2">Certificate of Completion</div>
          <div className="font-serif text-4xl sm:text-6xl mb-3">{state.profile.name}</div>
          <div className="text-sm text-[#1B1F4B]/80 mb-2">has completed 100% of lessons and passed the mastery quiz ({cert.scorePct}%) in</div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#5B4BFF]">{course.title}</div>
        </div>
        <div className="relative z-10 flex items-end justify-between pt-4 border-t border-[#1B1F4B]/15 text-xs">
          <div>
            <div className="font-serif text-xl italic">{course.instructor.name}</div>
            <div className="text-[10px] uppercase text-[#1B1F4B]/65">{course.instructor.role}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{cert.issuedAt}</div>
            <div className="text-[10px] uppercase text-[#1B1F4B]/65">Date Issued</div>
          </div>
        </div>
      </div>
    </div>
  );
}
