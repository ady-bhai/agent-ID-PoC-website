"use client";

import { useEffect } from "react";

/**
 * `/poc` was previously redirected via next.config. `output: "export"` does not
 * apply config redirects, so we client-redirect to `/demo` (with `basePath` when set).
 */
export default function PocRedirectPage() {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.location.replace(`${base}/demo`);
  }, []);

  return (
    <p className="mx-auto max-w-md px-4 py-16 text-center text-slate-600">
      Redirecting to the interactive demo…
    </p>
  );
}
