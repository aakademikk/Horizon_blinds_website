import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "ink" | "brand" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  ink: "btn-ink",
  brand: "btn-brand",
  outline: "btn-outline",
};

const SIZE: Record<Size, string> = {
  sm: "!px-6 !py-3 !text-[0.6875rem]",
  md: "",
  lg: "!px-10 !py-5 !text-[0.8125rem]",
};

function classes(variant: Variant, size: Size, className?: string) {
  return ["btn-base", VARIANT[variant], SIZE[size], className].filter(Boolean).join(" ");
}

export function CtaLink({
  href,
  children,
  variant = "ink",
  size = "md",
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

  if (external) {
    return (
      <a href={href} className={classes(variant, size, className)}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function CtaButton({
  children,
  variant = "ink",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
