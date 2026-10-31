"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

/** Soft cross-page transition: every navigation re-mounts this wrapper. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </m.div>
  );
}
