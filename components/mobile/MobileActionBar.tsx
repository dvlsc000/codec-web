"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Phone-only floating call button, bottom right: calling Codec is always one
 * tap away. Appears after the hero, steps aside over the footer, and is hidden
 * on the contact page (which has its own actions).
 */
export function MobileActionBar({
  callLabel,
  phoneHref,
  hideOn,
}: {
  callLabel: string;
  phoneHref: string;
  /** Paths where the bar should not show. */
  hideOn: string[];
}) {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const footer = document.getElementById("site-footer");
    const io = footer ? new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { rootMargin: "0px 0px -40px 0px" }) : null;
    if (footer && io) io.observe(footer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  const hidden = hideOn.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const show = pastHero && !atFooter && !hidden;

  return (
    <AnimatePresence>
      {show && (
        <m.a
          href={phoneHref}
          aria-label={callLabel}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-4 z-30 grid size-14 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-ember),var(--color-ember-soft))] text-night shadow-[0_12px_32px_-8px_rgb(255_90_31/0.75),0_0_0_1px_rgb(255_255_255/0.08)_inset] active:scale-95 lg:hidden"
        >
          <Icon name="phone" size={22} strokeWidth={2} />
        </m.a>
      )}
    </AnimatePresence>
  );
}
