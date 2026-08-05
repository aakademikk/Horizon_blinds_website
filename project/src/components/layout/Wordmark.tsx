/**
 * Horizon's mark, redrawn as SVG so it stays crisp at any size and can take
 * the header's colour. Their own lockup stacks the roundel above the name;
 * a nav bar is wider than it is tall, so this sets the roundel beside a
 * two-line name block — the same parts, turned on their side.
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
  const name = onDark ? "#FFFFFF" : "#10608F";
  const sub = onDark ? "rgba(255,255,255,0.66)" : "#5B6B76";
  // Instances sharing a tone can share a gradient; the two tones must not.
  const gid = `hz-fan-${tone}`;

  // 11 blades across a 168° arc.
  const blades = Array.from({ length: 11 }, (_, i) => -84 + i * 16.8);

  return (
    <svg viewBox="0 0 274 44" className={className} role="img" aria-label="Horizon Blinds & Shutters">
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={onDark ? "#2F9BD8" : "#10608F"} />
          <stop offset="55%" stopColor={onDark ? "#6EC7F0" : "#2F9BD8"} />
          <stop offset="100%" stopColor={onDark ? "#B9E4F7" : "#6EC7F0"} />
        </linearGradient>
      </defs>

      {/* Roundel */}
      <g transform="translate(22 22)">
        <circle r="20.25" fill="none" stroke={`url(#${gid})`} strokeWidth="1.5" />
        <g fill={`url(#${gid})`}>
          {blades.map((deg) => (
            <path
              key={deg}
              d="M -2.5 -3 L -1.15 -16.4 L 1.15 -16.4 L 2.5 -3 Z"
              transform={`rotate(${deg})`}
              opacity={Math.abs(deg) < 9 ? 1 : 0.78}
            />
          ))}
        </g>
        {/* Hub, sitting on the horizon line the blades rise from */}
        <circle cy="-1" r="3.1" fill={`url(#${gid})`} />
        <rect x="-14.5" y="1.9" width="29" height="1.4" rx="0.7" fill={`url(#${gid})`} opacity="0.85" />
      </g>

      <text
        x="55"
        y="22"
        fill={name}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="0.11em"
      >
        HORIZON
      </text>
      <text
        x="56.5"
        y="36.5"
        fill={sub}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="7.6"
        fontWeight="600"
        letterSpacing="0.235em"
      >
        BLINDS &amp; SHUTTERS
      </text>
    </svg>
  );
}
