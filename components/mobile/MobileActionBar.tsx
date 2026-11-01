"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Phone-only action bar, docked at the bottom like an app: call and book a call
 * are always one tap away. Appears after the hero, steps aside over the footer,
 * and is hidden on the contact page (which has its own actions).
 */
export function MobileActionBar({
  bookLabel,
  bookHref,
  callLabel,
  phoneHref,
  hideOn,
}: {
  bookLabel: string;
  bookHref: string;
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
        <m.div
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 110, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="flex items-center gap-2 rounded-[20px] border border-line-strong bg-night-2/95 p-2 shadow-[0_-10px_40px_-12px_rgb(0_0_0/0.9)] backdrop-blur-xl">
            <a
              href={phoneHref}
              aria-label={callLabel}
              className="grid size-12 shrink-0 place-items-center rounded-[14px] border border-line bg-night-3 text-ember transition-transform active:scale-95"
            >
              <Icon name="phone" size={20} />
            </a>
            <Link
              href={bookHref}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(110deg,var(--color-ember),var(--color-ember-soft))] font-medium text-night shadow-[0_8px_24px_-10px_rgb(255_90_31/0.8)] transition-transform active:scale-[0.98]"
            >
              {bookLabel}
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
