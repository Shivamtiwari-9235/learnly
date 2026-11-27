import courses from "@/data/courses";

export function getAllCourses() {
  return courses;
}

export function getCourseBySlug(slug) {
  if (!slug) return null;
  return courses.find((c) => c.slug === slug) || null;
}

export function flattenLessons(course) {
  if (!course || !Array.isArray(course.modules)) return [];
  return course.modules.flatMap((m) => m.lessons || []);
}

export function getLessonById(course, lessonId) {
  if (!course || !lessonId) return null;
  let globalIndex = 0;
  for (const mod of course.modules || []) {
    for (const lesson of mod.lessons || []) {
      if (lesson.id === lessonId) return { lesson, module: mod, index: globalIndex };
      globalIndex += 1;
    }
  }
  return null;
}

export function getNextLesson(course, lessonId) {
  const flat = flattenLessons(course);
  const idx = flat.findIndex((l) => l.id === lessonId);
  if (idx === -1 || idx >= flat.length - 1) return null;
  return flat[idx + 1];
}

export function getPrevLesson(course, lessonId) {
  const flat = flattenLessons(course);
  const idx = flat.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return null;
  return flat[idx - 1];
}

export function getTotalLessons(course) {
  return flattenLessons(course).length;
}
