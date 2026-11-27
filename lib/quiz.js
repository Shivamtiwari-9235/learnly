export function seededShuffle(arr, seed) {
  const copy = [...arr];
  let s = seed >>> 0;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function gradeAttempt(quiz, answers) {
  const total = quiz.questions.length;
  let correctCount = 0;
  const perQuestion = quiz.questions.map((q) => {
    const selectedIndex = answers[q.id] ?? null;
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      id: q.id,
      prompt: q.prompt,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });
  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const passed = percent >= (quiz.passingScore || 70);
  return { correctCount, total, percent, passed, perQuestion };
}

export function formatTimer(sec) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem < 10 ? "0" : ""}${rem}`;
}
