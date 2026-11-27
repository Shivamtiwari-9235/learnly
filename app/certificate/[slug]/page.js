import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/dataHelpers";
import CertificateClient from "./CertificateClient";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export default function CertificatePage({ params }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  return <CertificateClient course={course} />;
}
