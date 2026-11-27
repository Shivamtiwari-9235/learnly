"use client";

import { AVATAR_PALETTES, getInitials, hashString, levelFrame } from "@/lib/avatar";

export default function Avatar({ name = "Learner", config = {}, size = 36, level = 1 }) {
  const palette = AVATAR_PALETTES[config?.paletteId ?? 0] || AVATAR_PALETTES[0];
  const uid = `av-${hashString(`${name}-${size}-${level}-${config?.shape || "circle"}-${config?.paletteId || 0}`)}`;
  const initials = getInitials(name);
  const frame = levelFrame(level);

  let clipShape = <circle cx="50" cy="50" r="41" />;
  if (config?.shape === "squircle") clipShape = <rect x="9" y="9" width="82" height="82" rx="22" />;
  else if (config?.shape === "hexagon") clipShape = <polygon points="50,7 87,28 87,72 50,93 13,72 13,28" />;
  else if (config?.shape === "shield") clipShape = <path d="M50 8 L85 20 V48 C85 71 69 85 50 93 C31 85 15 71 15 48 V20 Z" />;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Avatar for ${name || "Learner"}`}
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          {palette.stops.map((c, i) => (
            <stop key={c} offset={`${Math.round((i / Math.max(1, palette.stops.length - 1)) * 100)}%`} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>{clipShape}</clipPath>
      </defs>

      {frame.tier === "plain" && <circle cx="50" cy="50" r="46" fill="none" stroke="#5B4BFF" strokeOpacity="0.35" strokeWidth="2.5" />}
      {frame.tier === "double" && (
        <>
          <circle cx="50" cy="50" r="47" fill="none" stroke="#5B4BFF" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" fill="none" stroke="#8F85FF" strokeOpacity="0.6" strokeWidth="1.5" />
        </>
      )}
      {frame.tier === "gold" && (
        <>
          <circle cx="50" cy="50" r="47" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="3.5" />
          <path d="M84 15 L86 20 L91 22 L86 24 L84 29 L82 24 L77 22 L82 20 Z" fill="#FFB020" />
        </>
      )}

      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="0" y="0" width="100" height="100" fill={`url(#${uid}-bg)`} />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={palette.text}
          fontFamily="var(--font-display), sans-serif"
          fontWeight="800"
          fontSize="30"
        >
          {initials}
        </text>
      </g>
    </svg>
  );
}
