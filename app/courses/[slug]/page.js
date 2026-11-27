import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/dataHelpers";
import CourseDetailClient from "./CourseDetailClient";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export default function CourseDetailPage({ params }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  return <CourseDetailClient course={course} />;
}
