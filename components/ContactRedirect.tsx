"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Tiny client component that runs `router.replace("/join")` on mount.
 *
 * `replace` (vs. `push`) keeps the redirect out of the browser's back
 * stack, so users hitting Back from /join don't bounce back here.
 *
 * Lives as its own file because the parent /contact page wants to be
 * a server component for its `metadata` export.
 */
export function ContactRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/join");
  }, [router]);

  return null;
}
