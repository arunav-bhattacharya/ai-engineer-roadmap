/** Colourful "AI" monogram tile — used for the AppBar mark and (mirrored) the favicon. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      role="img"
      aria-label="AI Engineer Roadmap"
    >
      <defs>
        <linearGradient id="logo-bg" x1="4" y1="2" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0a93c" />
          <stop offset="0.36" stopColor="#e07a9b" />
          <stop offset="0.7" stopColor="#9b7fe0" />
          <stop offset="1" stopColor="#4f9dd6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logo-bg)" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="'Google Sans Flex', system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="32"
        fontWeight="800"
        letterSpacing="-1"
        fill="#ffffff"
      >
        AI
      </text>
    </svg>
  );
}
