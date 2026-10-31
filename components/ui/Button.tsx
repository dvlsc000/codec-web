import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-chip)] font-medium transition-[background,color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";

const sizes = { md: "h-12 px-6 text-[0.95rem]", sm: "h-10 px-4 text-sm" };

const variants: Record<Variant, string> = {
  primary:
    "text-night bg-[linear-gradient(110deg,var(--color-ember),var(--color-ember-soft)_50%,var(--color-ember))] bg-[length:220%_100%] bg-left hover:bg-right shadow-[0_10px_36px_-12px_rgb(255_90_31/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] hover:shadow-[0_16px_46px_-12px_rgb(255_90_31/0.85),inset_0_1px_0_rgb(255_255_255/0.3)]",
  secondary: "text-fg border border-line-strong bg-white/[0.03] hover:bg-white/[0.07] hover:border-ember/50",
  ghost: "text-fg hover:text-ember px-0! h-auto!",
};

interface Common {
  variant?: Variant;
  size?: keyof typeof sizes;
  icon?: IconName;
  children: ReactNode;
  className?: string;
}

function Inner({ icon, children }: { icon?: IconName; children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      {icon && (
        <span className="relative inline-flex size-5 overflow-hidden">
          <Icon name={icon} size={18} className="absolute inset-0.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-5" />
          <Icon name={icon} size={18} className="absolute inset-0.5 -translate-x-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0" />
        </span>
      )}
    </>
  );
}

export function ButtonLink({ variant = "primary", size = "md", icon, children, className = "", ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

export function Button({ variant = "primary", size = "md", icon, children, className = "", ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}
