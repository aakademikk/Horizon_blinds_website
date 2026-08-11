/**
 * Horizon's mark, redrawn as SVG so it stays crisp at any size.
 *
 * The roundel (fan) sits above the wordmark — the same lockup they use
 * everywhere from their van to their Facebook page.
 *
 * The roundel is the fan from the logo: tapered blades rising from a low hub,
 * which reads as an opening louvre and as a sun on a horizon at the same time.
 */
export default function Wordmark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const onDark = tone === "light";
  // On a blue header, the fan needs to be white/light so it doesn't disappear.
  const name = onDark ? "#FFFFFF" : "#0870C0";
  const sub = onDark ? "rgba(255,255,255,0.68)" : "#5A9ED4";
  const gid = `hz-fan-${tone}`;

  // 11 blades across a 168° arc.
  const blades = Array.from({ length: 11 }, (_, i) => -84 + i * 16.8);

  return (
    <svg
      viewBox="0 0 160 80"
      className={className}
      role="img"
      aria-label="Horizon Blinds & Shutters"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={onDark ? "#FFFFFF" : "#065A9A"} />
          <stop offset="55%" stopColor={onDark ? "#D0ECF8" : "#0870C0"} />
          <stop offset="100%" stopColor={onDark ? "#A3DBF2" : "#4DA4DE"} />
        </linearGradient>
      </defs>

      {/* Roundel — centred horizontally, top half */}
      <g transform="translate(80 26)">
        <circle r="22" fill="none" stroke={`url(#${gid})`} strokeWidth="1.2" />
        <g fill={`url(#${gid})`}>
          {blades.map((deg) => (
            <path
              key={deg}
              d="M -2.5 -3.2 L -1.3 -18 L 1.3 -18 L 2.5 -3.2 Z"
              transform={`rotate(${deg})`}
              opacity={Math.abs(deg) < 9 ? 1 : 0.78}
            />
          ))}
        </g>
        {/* Hub, sitting on the horizon line the blades rise from */}
        <circle cy="-1" r="3.4" fill={`url(#${gid})`} />
        <rect x="-16" y="2" width="32" height="1.5" rx="0.75" fill={`url(#${gid})`} opacity="0.85" />
      </g>

      {/* HORIZON — centred below the roundel */}
      <text
        x="80"
        y="66"
        textAnchor="middle"
        fill={name}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="0.12em"
      >
        HORIZON
      </text>

      {/* BLINDS & SHUTTERS — subline */}
      <text
        x="80"
        y="76"
        textAnchor="middle"
        fill={sub}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="6.6"
        fontWeight="600"
        letterSpacing="0.26em"
      >
        BLINDS &amp; SHUTTERS
      </text>
    </svg>
  );
}
