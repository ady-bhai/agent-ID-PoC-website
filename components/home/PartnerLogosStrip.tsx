import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { withPublicBasePath } from "@/lib/paths";

/**
 * Partner logos above the footer. Replace assets in public/images/partners/
 * and set `href` on each entry in siteConfig.partnerLogos when URLs are final.
 */
export function PartnerLogosStrip() {
  const logos = siteConfig.partnerLogos;
  if (logos.length === 0) return null;

  return (
    <section
      aria-label="Partner organizations"
      className="border-b border-slate-200 bg-slate-50"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Partners
        </p>
        <ul className="flex list-none flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((logo) => {
            const img = (
              <Image
                src={withPublicBasePath(logo.image)}
                alt={logo.name}
                width={160}
                height={40}
                className="h-10 w-auto max-w-[140px] object-contain opacity-90 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
              />
            );
            const inner = img;
            return (
              <li key={logo.shortName} className="flex items-center">
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
                  >
                    {inner}
                  </a>
                ) : (
                  <span className="block">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default PartnerLogosStrip;
