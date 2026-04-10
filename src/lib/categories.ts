// Curated primary categories shown in the nav and home sections.
// Each entry has a persistent color used in the UI chrome.

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
    color: "bg-[#d63864]",
    text: "text-white",
    border: "border-[#d63864]",
  },
  {
    id: 82,
    slug: "lifestyle",
    name: "ไลฟ์สไตล์",
    emoji: "✨",
    color: "bg-[#2eb872]",
    text: "text-white",
    border: "border-[#2eb872]",
  },
  {
    id: 318,
    slug: "music",
    name: "เพลง",
    emoji: "🎧",
    color: "bg-[#7c4dcc]",
    text: "text-white",
    border: "border-[#7c4dcc]",
  },
  {
    id: 659,
    slug: "k-pop",
    name: "K-POP",
    emoji: "💜",
    color: "bg-[#c254a5]",
    text: "text-white",
    border: "border-[#c254a5]",
  },
  {
    id: 191,
    slug: "series",
    name: "ซีรีส์",
    emoji: "📺",
    color: "bg-[#1a9fc7]",
    text: "text-white",
    border: "border-[#1a9fc7]",
  },
  {
    id: 99,
    slug: "movies",
    name: "ภาพยนตร์",
    emoji: "🎬",
    color: "bg-[#d4a017]",
    text: "text-white",
    border: "border-[#d4a017]",
  },
  {
    id: 31,
    slug: "social",
    name: "โซเชียล",
    emoji: "🔥",
    color: "bg-[#d14832]",
    text: "text-white",
    border: "border-[#d14832]",
  },
  {
    id: 335,
    slug: "game",
    name: "เกม",
    emoji: "🎮",
    color: "bg-[#2d9e5a]",
    text: "text-white",
    border: "border-[#2d9e5a]",
  },
  {
    id: 9,
    slug: "food",
    name: "ของกิน",
    emoji: "🍜",
    color: "bg-[#cc8a14]",
    text: "text-white",
    border: "border-[#cc8a14]",
  },
  {
    id: 48,
    slug: "travel",
    name: "ท่องเที่ยว",
    emoji: "🌈",
    color: "bg-[#1a9e7a]",
    text: "text-white",
    border: "border-[#1a9e7a]",
  },
  {
    id: 14,
    slug: "it",
    name: "ไอที",
    emoji: "💾",
    color: "bg-[#3b5ccc]",
    text: "text-white",
    border: "border-[#3b5ccc]",
  },
];

export function findNavBySlug(slug: string): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.slug === slug);
}

export function findNavById(id: number): NavCategory | undefined {
  return NAV_CATEGORIES.find((c) => c.id === id);
}

// Stable "color index" from any string — used to give non-nav
// categories or tags a consistent color.
const PALETTE = [
  { bg: "bg-[#d63864]", text: "text-white" },
  { bg: "bg-[#2eb872]", text: "text-white" },
  { bg: "bg-[#7c4dcc]", text: "text-white" },
  { bg: "bg-[#1a9fc7]", text: "text-white" },
  { bg: "bg-[#d4a017]", text: "text-white" },
  { bg: "bg-[#d14832]", text: "text-white" },
  { bg: "bg-[#2d9e5a]", text: "text-white" },
  { bg: "bg-[#c254a5]", text: "text-white" },
  { bg: "bg-[#3b5ccc]", text: "text-white" },
];

export function colorFor(
  key: string | number,
): { bg: string; text: string } {
  const s = String(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
