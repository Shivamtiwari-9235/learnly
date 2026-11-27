"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import { AVATAR_PALETTES, AVATAR_SHAPES, generateAvatarConfig } from "@/lib/avatar";
import { useLearner } from "@/lib/store";
import Avatar from "@/components/profile/Avatar";

export default function ProfilePage() {
  const { state, dispatch, level, levelTitle } = useLearner();
  const [confirmReset, setConfirmReset] = useState(false);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "learnly-progress.json";
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={state.profile.name} config={state.profile.avatar} size={96} level={level} />
          <div>
            <h1 className="text-2xl font-extrabold">{state.profile.name}</h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">Lv.{level} {levelTitle} • {state.gamification.xp} XP</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Display Name</label>
            <input
              type="text"
              value={state.profile.name}
              onChange={(e) => dispatch({ type: "SET_PROFILE", payload: { name: e.target.value } })}
              className="w-full h-10 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-muted)]">Avatar Style</span>
              <button
                type="button"
                onClick={() => dispatch({ type: "SET_PROFILE", payload: { avatar: generateAvatarConfig(state.profile.name, (state.profile.avatar?.seed || 1) + 1) } })}
                className="px-3 py-1.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold flex items-center gap-1"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVATAR_SHAPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => dispatch({ type: "SET_PROFILE", payload: { avatar: { ...state.profile.avatar, shape: s } } })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border ${
                    state.profile.avatar?.shape === s ? "bg-[#5B4BFF] text-white border-[#5B4BFF]" : "border-[var(--border-subtle)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVATAR_PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.name}
                  onClick={() => dispatch({ type: "SET_PROFILE", payload: { avatar: { ...state.profile.avatar, paletteId: p.id } } })}
                  className={`w-7 h-7 rounded-full border-2 ${state.profile.avatar?.paletteId === p.id ? "border-black dark:border-white scale-110" : "border-transparent"}`}
                  style={{ background: `linear-gradient(135deg, ${p.stops.join(",")})` }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
            <button type="button" onClick={exportJSON} className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold">
              Export JSON
            </button>
            {!confirmReset ? (
              <button type="button" onClick={() => setConfirmReset(true)} className="px-4 py-2 rounded-xl bg-[#F04438]/10 text-[#F04438] text-xs font-bold">
                Reset All Progress
              </button>
            ) : (
              <button type="button" onClick={() => { dispatch({ type: "RESET_ALL" }); setConfirmReset(false); }} className="px-4 py-2 rounded-xl bg-[#F04438] text-white text-xs font-bold">
                Confirm Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
