export const AVATAR_PALETTES = [
  { id: 0, name: "Indigo Pulse", stops: ["#4A3BE0", "#7C5CFF"], text: "#FFFFFF" },
  { id: 1, name: "Sunset Amber", stops: ["#B45309", "#FFB020"], text: "#FFFFFF" },
  { id: 2, name: "Cyber Teal", stops: ["#0F766E", "#14B8A6"], text: "#FFFFFF" },
  { id: 3, name: "Coral Flame", stops: ["#C81E1E", "#FF6B5E"], text: "#FFFFFF" },
  { id: 4, name: "Midnight Iris", stops: ["#1E1B4B", "#5B4BFF"], text: "#FFFFFF" },
  { id: 5, name: "Emerald Mint", stops: ["#065F46", "#12B76A"], text: "#FFFFFF" },
  { id: 6, name: "Royal Plum", stops: ["#581C87", "#A855F7"], text: "#FFFFFF" },
  { id: 7, name: "Soft Ivory", stops: ["#E0E7FF", "#C7D2FE"], text: "#14142B" },
];

export const AVATAR_SHAPES = ["circle", "squircle", "hexagon", "shield"];
export const AVATAR_PATTERNS = ["dots", "waves", "grid", "rings", "none"];
export const AVATAR_GLYPHS = ["initials", "spark", "hex"];

export function hashString(str) {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getInitials(name) {
  const cleaned = String(name || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "L";
  const parts = cleaned.split(" ");
  if (parts.length === 1) return Array.from(parts[0]).slice(0, 2).join("").toUpperCase();
  const first = Array.from(parts[0])[0] || "";
  const last = Array.from(parts[parts.length - 1])[0] || "";
  return (first + last).toUpperCase() || "L";
}

export function generateAvatarConfig(name, seed = 1) {
  const h = hashString(`${name || "Learner"}::${seed}`);
  return {
    shape: AVATAR_SHAPES[h % AVATAR_SHAPES.length],
    paletteId: (h >>> 3) % AVATAR_PALETTES.length,
    pattern: AVATAR_PATTERNS[(h >>> 6) % AVATAR_PATTERNS.length],
    glyph: "initials",
    seed,
  };
}

export function levelFrame(level = 1) {
  if (level >= 5) return { tier: "gold", label: "Gold Sparkle (Lv.5+)" };
  if (level >= 3) return { tier: "double", label: "Double Ring (Lv.3-4)" };
  return { tier: "plain", label: "Plain Ring (Lv.1-2)" };
}
