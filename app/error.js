"use client";

export default function Error({ reset }) {
  return (
    <div className="max-w-lg mx-auto my-20 p-8 rounded-3xl border border-[#F04438]/40 bg-[#F04438]/5 text-center space-y-4">
      <h1 className="text-2xl font-extrabold text-[#F04438]">Something went wrong</h1>
      <p className="text-sm text-[var(--text-muted)]">An unexpected error occurred while rendering this page.</p>
      <button type="button" onClick={() => reset()} className="px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">
        Try Again
      </button>
    </div>
  );
}
