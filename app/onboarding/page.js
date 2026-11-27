"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { useLearner } from "@/lib/store";
import { AVATAR_SHAPES, generateAvatarConfig } from "@/lib/avatar";
import Avatar from "@/components/profile/Avatar";

const INTERESTS = ["AI Engineering", "Cybersecurity", "Product Design"];

export default function OnboardingPage() {
  const router = useRouter();
  const { state, dispatch, level } = useLearner();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(state.profile.name === "Learner" ? "" : state.profile.name);
  const [interests, setInterests] = useState(state.profile.interests || ["AI Engineering"]);
  const [dailyGoal, setDailyGoal] = useState(state.profile.dailyGoal || 20);
  const [avatar, setAvatar] = useState(state.profile.avatar || generateAvatarConfig("Learner", 1));
  const [error, setError] = useState("");

  const toggleInterest = (item) => {
    setInterests((prev) => (prev.includes(item) ? (prev.length > 1 ? prev.filter((x) => x !== item) : prev) : [...prev, item]));
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError("Please enter your name or click Skip.");
      return;
    }
    setError("");
    if (step < 4) setStep(step + 1);
    else {
      dispatch({
        type: "SET_PROFILE",
        payload: { name: name.trim() || "Learner", interests, dailyGoal, avatar, onboarded: true },
      });
      router.push("/courses");
    }
  };

  const handleSkip = () => {
    dispatch({
      type: "SET_PROFILE",
      payload: { name: "Learner", interests, dailyGoal: 20, avatar: generateAvatarConfig("Learner", 1), onboarded: true },
    });
    router.push("/courses");
  };

  return (
    <div className="min-h-[82vh] bg-gradient-to-br from-[#5B4BFF] to-[#7C5CFF] p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-[560px] rounded-3xl bg-[var(--bg-raised)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`h-1.5 w-8 rounded-full ${step >= n ? "bg-[#5B4BFF]" : "bg-[var(--border-subtle)]"}`} />
            ))}
          </div>
          <button type="button" onClick={handleSkip} className="text-xs font-semibold text-[var(--text-muted)] hover:underline">
            Skip
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold">Welcome to Learnly</h1>
            <p className="text-sm text-[var(--text-muted)]">Personalize your recommendations and certificate name.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setAvatar(generateAvatarConfig(e.target.value || "Learner", avatar.seed));
                setError("");
              }}
              placeholder="e.g., Shivam Tiwari"
              className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm"
            />
            {error && <p className="text-xs text-[#F04438] font-medium">{error}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold">Pick your focus areas</h1>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                    interests.includes(item) ? "bg-[#5B4BFF] text-white border-[#5B4BFF]" : "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold">Daily study goal</h1>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 30].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDailyGoal(m)}
                  className={`p-4 rounded-2xl border text-center ${
                    dailyGoal === m ? "border-2 border-[#5B4BFF] bg-[#5B4BFF]/10" : "border-[var(--border-subtle)]"
                  }`}
                >
                  <div className="text-2xl font-extrabold">{m}</div>
                  <div className="text-xs text-[var(--text-muted)]">min/day</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-extrabold">Customize your avatar</h1>
            <div className="flex justify-center">
              <Avatar name={name || "Learner"} config={avatar} size={96} level={level} />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setAvatar(generateAvatarConfig(name || "Learner", avatar.seed + 1))}
                className="px-3.5 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
              {AVATAR_SHAPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setAvatar({ ...avatar, shape: s })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border ${
                    avatar.shape === s ? "border-[#5B4BFF] bg-[#5B4BFF]/10" : "border-[var(--border-subtle)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-bold disabled:opacity-40"
          >
            Back
          </button>
          <button type="button" onClick={handleNext} className="px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">
            {step === 4 ? "Finish & Explore" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
