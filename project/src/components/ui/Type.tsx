import type { ReactNode } from "react";

/**
 * Small caps label with a short gold rule. Used above almost every heading
 * on the site — it is what holds the layout together.
 */
export function Eyebrow({
  children,
  className,
  tone = "dark",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
}) {
  return (
    <div
      className={[
        "eyebrow flex items-center gap-3",
        align === "center" ? "justify-center" : "",
        tone === "light" ? "text-gold-light" : "text-gold-deep",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "dark",
  className,
  as: Tag = "h2",
  size = "lg",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "lg" | "md";
}) {
  const sizeClass = size === "xl" ? "display-xl" : size === "md" ? "display-md" : "display-lg";
  return (
    <div
      className={[
        align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && (
        <Eyebrow tone={tone} align={align} className="mb-5 md:mb-6">
          {eyebrow}
        </Eyebrow>
      )}
      <Tag className={`${sizeClass} ${tone === "light" ? "text-white" : "text-ink"}`}>{title}</Tag>
      {lede && (
        <p className={`lede mt-5 md:mt-7 ${tone === "light" ? "!text-white/65" : ""}`}>{lede}</p>
      )}
    </div>
  );
}

/** Five gold stars. `size` is the em-height of each glyph. */
export function Stars({
  rating = 5,
  size = 14,
  className,
  label,
}: {
  rating?: number;
  size?: number;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={["inline-flex items-center gap-[0.18em]", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={label ?? `${rating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(1, Math.max(0, rating - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden focusable="false">
            <defs>
              <linearGradient id={`s${i}-${size}-${Math.round(rating * 10)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#C9A646" />
                <stop offset={`${fill * 100}%`} stopColor="#D8D3C7" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.47 5.3 5.53.62-4.1 3.9 1.1 5.5L10 14.2l-5 2.72 1.1-5.5-4.1-3.9 5.53-.62z"
              fill={`url(#s${i}-${size}-${Math.round(rating * 10)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={["rule-fade", className].filter(Boolean).join(" ")} />;
}
