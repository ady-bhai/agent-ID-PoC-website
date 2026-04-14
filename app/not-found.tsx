import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-[#1a2744]">Page not found</h1>
      <p className="mt-3 text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-[#0f4c5c] underline-offset-2 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
