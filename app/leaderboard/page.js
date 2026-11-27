"use client";

import { MOCK_LEARNERS } from "@/data/learners";
import { useLearner } from "@/lib/store";
import Avatar from "@/components/profile/Avatar";

export default function LeaderboardPage() {
  const { state, level } = useLearner();
  const rows = [
    ...MOCK_LEARNERS.map((u) => ({ ...u, isMe: false })),
    { id: "you", name: state.profile.name || "Learner", flag: "🇮🇳", xp: state.gamification.xp, streak: state.gamification.streak, cat: "Your Track", isMe: true },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Community Leaderboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Your rank updates live as you complete lessons, quizzes, and certificates.</p>
      </div>

      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] divide-y divide-[var(--border-subtle)] overflow-hidden">
        {rows.map((u, idx) => (
          <div key={u.id} className={`px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm ${u.isMe ? "bg-[#5B4BFF]/10 font-bold" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="w-7 font-extrabold">#{idx + 1}</span>
              <Avatar name={u.name} config={u.isMe ? state.profile.avatar : undefined} size={32} level={u.isMe ? level : 1} />
              <div>
                <div>{u.flag} {u.name} {u.isMe && <span className="ml-1 px-1.5 py-0.5 rounded bg-[#5B4BFF] text-white text-[10px]">You</span>}</div>
                <div className="text-[11px] text-[var(--text-muted)] font-normal">{u.cat} • 🔥 {u.streak}d</div>
              </div>
            </div>
            <span className="font-extrabold text-[var(--brand-text)]">{u.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
