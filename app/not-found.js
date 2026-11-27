import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto my-20 p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-raised)] text-center space-y-4">
      <div className="text-5xl font-extrabold text-[#5B4BFF]">404</div>
      <h1 className="text-2xl font-extrabold">Page Not Found</h1>
      <p className="text-sm text-[var(--text-muted)]">The course or lesson you are looking for does not exist.</p>
      <Link href="/courses" className="inline-block px-5 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold">
        Browse Courses
      </Link>
    </div>
  );
}
