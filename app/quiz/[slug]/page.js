import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/dataHelpers";
import QuizClient from "./QuizClient";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export default function QuizPage({ params }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  return <QuizClient course={course} />;
}
