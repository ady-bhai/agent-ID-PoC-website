import type { Metadata } from "next";
import Link from "next/link";
import { ContactRedirect } from "@/components/ContactRedirect";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "The contact page has moved — find ways to reach the Agent ID research team on the Join page.",
  alternates: {
    canonical: "/join",
  },
  robots: { index: false, follow: true },
};

/**
 * /contact has been replaced by /join. The route is preserved so any
 * external links (slide decks, prior tweets, search results) still
 * work and can be updated.
 *
 * Output is static (`output: "export"`) so we cannot use Next.js'
 * server-side `redirect()`. We rely on a client-side `router.replace`
 * via `ContactRedirect`, with a manual fallback link below for the
 * vanishingly rare case of JS being disabled.
 */
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <ContactRedirect />
      <h1 className="text-2xl font-semibold tracking-tight text-[#1a2744]">
        This page moved
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        Contact lives on{" "}
        <Link
          href="/join"
          className="font-medium text-[#1a2744] underline underline-offset-4"
        >
          /join
        </Link>{" "}
        now. Redirecting&hellip;
      </p>
    </div>
  );
}
