import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/** Closing conversion panel used at the bottom of most pages. */
export function CtaBand({ title, text, primary, secondary }: { title: string; text: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="container-site pt-8">
      <Reveal>
        <div data-accent="ember" className="edge-glow relative isolate overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2 px-6 py-16 md:px-16 md:py-24">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute -bottom-1/2 left-1/2 h-[140%] w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_90_31/0.28),rgb(211_214_220/0.18)_55%,transparent)] blur-2xl" />
            <svg className="absolute inset-x-0 bottom-0 h-40 w-full opacity-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
              <path d="M0 80 C 120 20, 200 140, 320 80 S 520 20, 640 80 S 760 140, 840 80 L 860 80 L 860 40 L 900 40 L 900 120 L 940 120 L 940 40 L 980 40 L 980 120 L 1020 120 L 1020 40 L 1060 40 L 1060 120 L 1100 120 L 1100 80 L 1200 80" fill="none" stroke="url(#cta-g)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="cta-g" x1="0" x2="1">
                  <stop offset="0" stopColor="#FF5A1F" stopOpacity="0" />
                  <stop offset=".3" stopColor="#FF5A1F" />
                  <stop offset=".9" stopColor="#D3D6DC" />
                  <stop offset="1" stopColor="#D3D6DC" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-h1">{title}</h2>
            <p className="text-lead mx-auto mt-6 max-w-[54ch]">{text}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href={primary.href} icon="arrowRight">{primary.label}</ButtonLink>
              {secondary && <ButtonLink href={secondary.href} variant="secondary">{secondary.label}</ButtonLink>}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
