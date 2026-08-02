/**
 * Wordmark: a louvred "F" monogram beside the name. Drawn rather than set in
 * an image so it stays crisp at any size and inherits the header's colour.
 */
export default function Wordmark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const ink = tone === "light" ? "#FFFFFF" : "#111111";
  const sub = tone === "light" ? "rgba(255,255,255,0.6)" : "#666666";

  return (
    <svg viewBox="0 0 268 44" className={className} role="img" aria-label="Fab Shutters & Blinds">
      {/* Monogram: a shutter panel with its louvres half open */}
      <g>
        <rect x="1" y="1" width="42" height="42" fill="none" stroke="#C9A646" strokeWidth="1.5" />
        {[9, 16, 23, 30, 37].map((y) => (
          <rect key={y} x="7.5" y={y - 2.4} width="29" height="4.6" rx="1" fill="#C9A646" opacity={y === 23 ? 1 : 0.72} />
        ))}
      </g>

      <text
        x="58"
        y="22"
        fill={ink}
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="23"
        fontWeight="400"
        letterSpacing="0.01em"
      >
        Fab Shutters
      </text>
      <text
        x="58"
        y="37"
        fill={sub}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="500"
        letterSpacing="0.36em"
      >
        &amp; BLINDS · ESSEX
      </text>
    </svg>
  );
}
