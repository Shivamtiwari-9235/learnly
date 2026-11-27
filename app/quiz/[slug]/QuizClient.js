"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { gradeAttempt, seededShuffle } from "@/lib/quiz";
import { useLearner } from "@/lib/store";

export default function QuizClient({ course }) {
  const { state, dispatch } = useLearner();
  const [seed, setSeed] = useState(1);
  const [questions, setQuestions] = useState(course.quiz.questions);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const result = submitted ? gradeAttempt({ ...course.quiz, questions }, answers) : null;
  const hasCert = Boolean(state.certificates[course.slug]);

  const handleSubmit = () => {
    const res = gradeAttempt({ ...course.quiz, questions }, answers);
    setSubmitted(true);
    dispatch({ type: "SAVE_QUIZ_ATTEMPT", course, percent: res.percent, passed: res.passed, correctCount: res.correctCount });
  };

  const handleRetry = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setQuestions(seededShuffle(course.quiz.questions, nextSeed));
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold">{course.title} — Mastery Quiz</h1>
          <p className="text-xs text-[var(--text-muted)]">{questions.length} questions • {course.quiz.passingScore}% pass mark</p>
        </div>

        {result && (
          <div className={`p-5 rounded-2xl border ${result.passed ? "border-[#12B76A] bg-[#12B76A]/10" : "border-[#F04438] bg-[#F04438]/10"} flex flex-wrap items-center justify-between gap-4`}>
            <div>
              <div className="text-xl font-extrabold">{result.percent}% ({result.correctCount}/{result.total})</div>
              <div className="text-xs font-semibold">{result.passed ? "Passed! Great mastery." : "Below 70% — review explanations and retry."}</div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleRetry} className="px-4 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">Retry</button>
              {hasCert && <Link href={`/certificate/${course.slug}`} className="px-4 py-2 rounded-xl bg-[#12B76A] text-white text-xs font-bold">View Certificate</Link>}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {questions.map((q, qi) => (
            <div key={q.id} className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
              <div className="font-bold text-sm">{qi + 1}. {q.prompt}</div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const sel = answers[q.id] === oi;
                  const right = q.correctIndex === oi;
                  let cls = "border-[var(--border-subtle)] bg-[var(--bg-raised)]";
                  if (!submitted && sel) cls = "border-2 border-[#5B4BFF] bg-[#5B4BFF]/10";
                  if (submitted && right) cls = "border-2 border-[#12B76A] bg-[#12B76A]/10";
                  if (submitted && sel && !right) cls = "border-2 border-[#F04438] bg-[#F04438]/10";
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 ${cls}`}
                    >
                      <span>{opt}</span>
                      {submitted && right && <span className="text-[#12B76A] font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Correct</span>}
                      {submitted && sel && !right && <span className="text-[#F04438] font-bold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Incorrect</span>}
                    </button>
                  );
                })}
              </div>
              {submitted && <div className="text-xs text-[var(--text-muted)]">{q.explanation}</div>}
            </div>
          ))}
        </div>

        {!submitted && (
          <button type="button" onClick={handleSubmit} className="w-full py-3 rounded-xl bg-[#5B4BFF] text-white text-sm font-bold">
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
