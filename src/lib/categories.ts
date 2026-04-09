// Curated primary categories shown in the nav and home sections.
// Each entry has a persistent "vibe color" used in the UI chrome so
// navigation has a consistent sticker-like feel regardless of which
// article is on screen.

export type NavCategory = {
  id: number;
  slug: string; // used in our /category/[slug] URLs (pretty alias)
  name: string;
  emoji: string;
  color: string; // tailwind bg class
  text: string; // tailwind text class for contrast
  border: string;
};

// Slugs below are decoded pretty aliases we show in URLs. When hitting
// the REST API we match by id (more reliable than the mojibake slugs).
export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: 16,
    slug: "entertainment",
    name: "บันเทิง",
    emoji: "🎤",
    color: "bg-[#ff2d87]",
    text: "text-white",
    border: "border-[#ff2d87]",
  },
  {
    id: 82,
    slug: "lifestyle",
    name: "ไลฟ์สไตล์",
    emoji: "✨",
    color: "bg-[#7cf3a7]",
    text: "text-black",
    border: "border-[#7cf3a7]",
  },
  {
    id: 318,
    slug: "music",
    name: "เพลง",
    emoji: "🎧",
    color: "bg-[#a066ff]",
    text: "text-white",
    border: "border-[#a066ff]",
  },
  {
    id: 659,
    slug: "k-pop",
    name: "K-POP",
    emoji: "💜",
    color: "bg-[#ff6bd6]",
    text: "text-black",
    border: "border-[#ff6bd6]",
  },
  {
    id: 191,
    slug: "series",
    name: "ซีรีส์",
    emoji: "📺",
    color: "bg-[#00d4ff]",
    text: "text-black",
    border: "border-[#00d4ff]",
  },
  {
    id: 99,
    slug: "movies",
    name: "ภาพยนตร์",
    emoji: "🎬",
    color: "bg-[#ffd60a]",
    text: "text-black",
    border: "border-[#ffd60a]",
  },
  {
    id: 31,
    slug: "social",
    name: "โซเชียล",
    emoji: "🔥",
    color: "bg-[#ff5e3a]",
    text: "text-white",
    border: "border-[#ff5e3a]",
  },
  {
    id: 335,
    slug: "game",
    name: "เกม",
    emoji: "🎮",
    color: "bg-[#39ff14]",
    text: "text-black",
    border: "border-[#39ff14]",
  },
  {
    id: 9,
    slug: "food",
    name: "ของกิน",
    emoji: "🍜",
    color: "bg-[#ffb700]",
    text: "text-black",
    border: "border-[#ffb700]",
  },
  {
    id: 48,
    slug: "travel",
    name: "ท่องเที่ยว",
    emoji: "🌈",
    color: "bg-[#00e5a8]",
    text: "text-black",
    border: "border-[#00e5a8]",
  },
  {
    id: 14,
    slug: "it",
    name: "ไอที",
    emoji: "💾",
    color: "bg-[#4c6fff]",
    text: "text-white",
    border: "border-[#4c6fff]",
  },
];

export function findNavBySlug(slug: string): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.slug === slug);
}

export function findNavById(id: number): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.id === id);
}

// Stable "color index" from any string — used to give non-nav
// categories or tags a consistent playful color.
const PALETTE = [
  { bg: "bg-[#ff2d87]", text: "text-white" },
  { bg: "bg-[#7cf3a7]", text: "text-black" },
  { bg: "bg-[#a066ff]", text: "text-white" },
  { bg: "bg-[#00d4ff]", text: "text-black" },
  { bg: "bg-[#ffd60a]", text: "text-black" },
  { bg: "bg-[#ff5e3a]", text: "text-white" },
  { bg: "bg-[#39ff14]", text: "text-black" },
  { bg: "bg-[#ff6bd6]", text: "text-black" },
  { bg: "bg-[#4c6fff]", text: "text-white" },
];

export function colorFor(
  key: string | number,
): { bg: string; text: string } {
  const s = String(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
