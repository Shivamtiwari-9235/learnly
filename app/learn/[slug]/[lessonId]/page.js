import { notFound } from "next/navigation";
import { flattenLessons, getAllCourses, getCourseBySlug, getLessonById } from "@/lib/dataHelpers";
import LessonPlayerClient from "./LessonPlayerClient";

export function generateStaticParams() {
  const params = [];
  for (const course of getAllCourses()) {
    for (const lesson of flattenLessons(course)) {
      params.push({ slug: course.slug, lessonId: lesson.id });
    }
  }
  return params;
}

export default function LessonPlayerPage({ params }) {
  const course = getCourseBySlug(params.slug);
  const found = getLessonById(course, params.lessonId);
  if (!course || !found) notFound();
  return <LessonPlayerClient course={course} lesson={found.lesson} lessonIndex={found.index} />;
}
