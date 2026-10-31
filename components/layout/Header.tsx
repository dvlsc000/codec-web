"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import type { Accent } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import type { ServiceSlugTable } from "@/lib/i18n/switch";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { site } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";

export interface HeaderProps {
  locale: Locale;
  homeHref: string;
  contactHref: string;
  servicesHref: string;
  labels: { menu: string; closeMenu: string; language: string; bookCall: string; allServices: string; home: string };
  nav: { label: string; href: string; withServices?: boolean }[];
  services: { id: string; title: string; summary: string; href: string; icon: IconName; accent: Accent }[];
  slugTable: ServiceSlugTable;
}

const ease = [0.16, 1, 0.3, 1] as const;

export function Header(props: HeaderProps) {
  const { locale, homeHref, contactHref, servicesHref, labels, nav, services, slugTable } = props;
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Glass after leaving the top; tuck away while scrolling down, return on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 320 && y > prev && !mobileOpen && !dropdown);
  });

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || (href.split("/").length > 2 && pathname.startsWith(href + "/"));
  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setDropdown(false), 140);
  };

  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="container-site pt-3 md:pt-4">
          <div
            className={`flex h-16 items-center justify-between gap-4 rounded-[var(--radius-card)] px-3 pl-4 transition-[background,border-color,box-shadow,backdrop-filter] duration-500 md:px-4 md:pl-5 ${
              mobileOpen ? "border border-line bg-night-2" : scrolled ? "glass max-lg:[background:rgb(22_23_27)]! max-lg:[backdrop-filter:none]!" : "border border-transparent"
            }`}
          >
            <Link href={homeHref} className="rounded-lg" aria-label={`Codec — ${labels.home}`}>
              <Logo animated className="h-[30px]" />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 xl:gap-1.5">
                {nav.map((item) =>
                  item.withServices ? (
                    <li key={item.href} className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className="relative rounded-full py-2 pl-3 pr-1 text-[0.92rem] text-muted transition-colors hover:text-fg aria-[current=page]:text-fg after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:size-[5px] after:-translate-x-1/2 after:rounded-[1px] after:bg-ember after:opacity-0 after:transition-opacity aria-[current=page]:after:opacity-100"
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={dropdown}
                          aria-controls={dropdownId}
                          aria-label={item.label}
                          onClick={() => setDropdown((v) => !v)}
                          onFocus={openDropdown}
                          className="grid size-8 place-items-center rounded-full text-muted hover:text-fg"
                        >
                          <Icon name="chevronDown" size={16} className={`transition-transform duration-300 ${dropdown ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {dropdown && (
                          <m.div
                            id={dropdownId}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.35, ease }}
                            className="absolute left-1/2 top-full w-[min(44rem,90vw)] -translate-x-1/2 pt-3"
                            onBlur={(e) => {
                              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdown(false);
                            }}
                          >
                            <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-card)] border border-line-strong bg-night-2/95 p-2 shadow-[0_40px_80px_-30px_rgb(3_6_20/0.9)] backdrop-blur-xl">
                              {services.map((s) => (
                                <Link
                                  key={s.id}
                                  href={s.href}
                                  data-accent={s.accent}
                                  className="group flex gap-3.5 rounded-[16px] p-3.5 transition-colors hover:bg-white/[0.05]"
                                >
                                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-night-2 text-[var(--accent)] transition-transform duration-500 group-hover:scale-110">
                                    <Icon name={s.icon} size={20} />
                                  </span>
                                  <span>
                                    <span className="block font-medium text-fg">{s.title}</span>
                                    <span className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{s.summary}</span>
                                  </span>
                                </Link>
                              ))}
                              <Link
                                href={servicesHref}
                                className="col-span-2 mt-1 flex items-center justify-between rounded-[14px] border border-line px-4 py-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
                              >
                                {labels.allServices}
                                <Icon name="arrowRight" size={16} />
                              </Link>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="relative rounded-full px-3 py-2 text-[0.92rem] text-muted transition-colors hover:text-fg aria-[current=page]:text-fg after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:size-[5px] after:-translate-x-1/2 after:rounded-[1px] after:bg-ember after:opacity-0 after:transition-opacity aria-[current=page]:after:opacity-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={locale} label={labels.language} slugTable={slugTable} />
              <span className="hidden sm:block lg:hidden xl:block">
                <ButtonLink href={contactHref} size="sm">
                  {labels.bookCall}
                </ButtonLink>
              </span>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-line text-fg lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? labels.closeMenu : labels.menu}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <Icon name={mobileOpen ? "close" : "menu"} size={20} />
              </button>
            </div>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {mobileOpen && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={labels.menu}
            className="fixed inset-0 z-40 flex flex-col bg-night lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.18),transparent)]" />
              <div className="pixel-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" />
            </div>

            <m.nav
              aria-label="Mobile"
              className="container-site relative flex-1 overflow-y-auto overscroll-contain pb-6 pt-[5.75rem]"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
            >
              <ul>
                {nav.map((item, idx) => {
                  const active = isActive(item.href);
                  return (
                    <m.li
                      key={item.href}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
                      className="border-b border-line"
                    >
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className="group flex flex-1 items-center gap-3 py-[0.95rem]"
                        >
                          <span className="w-5 font-display text-[0.7rem] tabular-nums text-subtle">{String(idx + 1).padStart(2, "0")}</span>
                          <span className={`font-display text-[1.3rem] font-medium tracking-[-0.03em] ${active ? "text-fg" : "text-fg/80"}`}>{item.label}</span>
                          {active && <span aria-hidden="true" className="size-[6px] rounded-[1px] bg-ember" />}
                        </Link>
                        {item.withServices ? (
                          <button
                            type="button"
                            aria-expanded={servicesOpen}
                            aria-controls="mobile-services"
                            aria-label={item.label}
                            onClick={() => setServicesOpen((v) => !v)}
                            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors active:bg-white/5"
                          >
                            <Icon name="chevronDown" size={18} className={`transition-transform duration-300 ${servicesOpen ? "rotate-180 text-ember" : ""}`} />
                          </button>
                        ) : (
                          <Icon name="arrowRight" size={18} className="mr-3 text-subtle" />
                        )}
                      </div>

                      {item.withServices && (
                        <AnimatePresence initial={false}>
                          {servicesOpen && (
                            <m.ul
                              id="mobile-services"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease }}
                              className="grid gap-2 overflow-hidden"
                            >
                              {services.map((s, k) => (
                                <li key={s.id} className={k === services.length - 1 ? "pb-4" : ""}>
                                  <Link
                                    href={s.href}
                                    data-accent={s.accent}
                                    className="flex items-center gap-3 rounded-[14px] border border-line bg-white/[0.025] p-3 active:bg-white/[0.06]"
                                  >
                                    <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-night-2 text-[var(--accent)]">
                                      <Icon name={s.icon} size={19} />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-[0.95rem] font-medium text-fg">{s.title}</span>
                                      <span className="mt-0.5 line-clamp-1 text-[0.8rem] text-muted">{s.summary}</span>
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </m.ul>
                          )}
                        </AnimatePresence>
                      )}
                    </m.li>
                  );
                })}
              </ul>
            </m.nav>

            {/* Always visible at the bottom */}
            <m.div
              className="container-site relative border-t border-line bg-night/90 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.2 }}
            >
              <ButtonLink href={contactHref} icon="arrowRight" className="w-full">
                {labels.bookCall}
              </ButtonLink>
              <a href={`tel:${site.contact.phones.main.href}`} className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
                <span className="relative flex size-1.5" aria-hidden="true">
                  <span className="animate-pulse-ring absolute inline-flex size-full rounded-[1px] bg-ember" />
                  <span className="relative inline-flex size-1.5 rounded-[1px] bg-ember" />
                </span>
                0–24 · {site.contact.phones.main.display}
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
