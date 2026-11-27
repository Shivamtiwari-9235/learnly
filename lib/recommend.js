export function recommendCourses(courses, interests = []) {
  const set = new Set((interests || []).map((s) => s.toLowerCase()));
  return [...courses].sort((a, b) => {
    const score = (c) =>
      (set.has(c.category.toLowerCase()) ? 10 : 0) +
      (c.tags || []).filter((t) => set.has(t.toLowerCase())).length * 3 +
      (c.level === "Beginner" ? 1 : 0);
    return score(b) - score(a);
  });
}
