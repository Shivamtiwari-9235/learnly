export function getCertificateEligibility({ completedLessons, totalLessons, bestQuizScore, passingScore = 70 }) {
  const missing = [];
  const rem = Math.max(0, totalLessons - completedLessons);
  if (rem > 0) missing.push(`${rem} lesson${rem > 1 ? "s" : ""} remaining`);
  if (bestQuizScore === null || bestQuizScore === undefined || bestQuizScore < passingScore) {
    missing.push(bestQuizScore === null || bestQuizScore === undefined ? `Pass quiz (need ${passingScore}%)` : `Best ${bestQuizScore}%, need ${passingScore}%`);
  }
  return { eligible: missing.length === 0, missing };
}

export function deterministicCertId(name, courseId, issueDate) {
  let h = 2166136261;
  const str = `${name}::${courseId}::${issueDate}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const code = (h >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return `LRN-${new Date().getFullYear()}-${code}`;
}
