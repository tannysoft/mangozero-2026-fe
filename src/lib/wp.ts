// WordPress REST API client for mangozero.com.
// Lightweight fetchers with ISR caching + types for the fields we actually use.

export const WP_ORIGIN = "https://www.mangozero.com";
const WP_BASE = `${WP_ORIGIN}/wp-json/wp/v2`;
const REVALIDATE = 300; // 5 min

// iThemes / Cloudflare sometimes block empty UAs, keep a browser UA.
// `Connection: close` prevents undici on Vercel from reusing stale keep-alive
// sockets that the origin (or Cloudflare) has already dropped — that reuse is
// the root cause of the intermittent `fetch failed` we see in Vercel logs.
const WP_HEADERS = {
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Connection: "close",
} as const;

// Retry wrapper for transient network errors (ECONNRESET, socket hang up,
// fetch failed) that happen on cross-region Vercel → TH origin calls.
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = 2,
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const ac = new AbortController();
      const timeout = setTimeout(() => ac.abort(), 15_000);
      try {
        return await fetch(url, { ...init, signal: ac.signal });
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        // 250ms, 750ms — small backoff, keep total under ~1s
        await new Promise((r) => setTimeout(r, 250 * (attempt + 1) ** 2));
      }
    }
  }
  throw lastErr;
}

// ---------- types ----------

export type WPRendered = { rendered: string; protected?: boolean };

export type WPPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      slug?: string;
      link?: string;
      avatar_urls?: Record<string, string>;
    }>;
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_details?: {
        width?: number;
        height?: number;
        sizes?: Record<
          string,
          { source_url: string; width: number; height: number }
        >;
      };
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: string;
        link: string;
      }>
    >;
  };
};

export type WPCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  link: string;
};

export type WPTag = {
  id: number;
  count: number;
  name: string;
  slug: string;
  link: string;
};

export type WPUser = {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: Record<string, string>;
};

// ---------- internal ----------

// Warm-instance stale cache. Vercel keeps module state alive across
// invocations on the same Lambda container, so this Map survives between
// requests (typically minutes to hours). When a fetch fails we serve the
// last known-good payload instead of returning empty — the user sees
// slightly stale content rather than a blank page.
const STALE_CACHE = new Map<string, { data: unknown; at: number }>();
const STALE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h

async function wpFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const url = `${WP_BASE}${path}`;
  try {
    const res = await fetchWithRetry(url, {
      ...init,
      next: { revalidate: REVALIDATE },
      headers: { ...WP_HEADERS, ...(init?.headers || {}) },
    });
    if (!res.ok) {
      console.error(`[wpFetch] ${res.status} ${res.statusText} ${url}`);
      return serveStale<T>(url);
    }
    const data = (await res.json()) as T;
    STALE_CACHE.set(url, { data, at: Date.now() });
    return data;
  } catch (err) {
    console.error(
      `[wpFetch] threw ${err instanceof Error ? err.message : err} ${url}`,
    );
    return serveStale<T>(url);
  }
}

function serveStale<T>(url: string): T | null {
  const hit = STALE_CACHE.get(url);
  if (!hit) return null;
  if (Date.now() - hit.at > STALE_MAX_AGE_MS) {
    STALE_CACHE.delete(url);
    return null;
  }
  console.warn(`[wpFetch] serving stale ${url}`);
  return hit.data as T;
}

// ---------- posts ----------

export async function getPosts(
  params: {
    perPage?: number;
    page?: number;
    categories?: number | number[];
    excludeCategories?: number | number[];
    tags?: number | number[];
    author?: number;
    exclude?: number[];
    search?: string;
    embed?: boolean;
  } = {},
): Promise<WPPost[]> {
  const sp = new URLSearchParams();
  sp.set("per_page", String(params.perPage ?? 12));
  if (params.page) sp.set("page", String(params.page));
  if (params.categories) {
    sp.set(
      "categories",
      Array.isArray(params.categories)
        ? params.categories.join(",")
        : String(params.categories),
    );
  }
  if (params.excludeCategories) {
    sp.set(
      "categories_exclude",
      Array.isArray(params.excludeCategories)
        ? params.excludeCategories.join(",")
        : String(params.excludeCategories),
    );
  }
  if (params.tags) {
    sp.set(
      "tags",
      Array.isArray(params.tags) ? params.tags.join(",") : String(params.tags),
    );
  }
  if (params.author) sp.set("author", String(params.author));
  if (params.exclude?.length) sp.set("exclude", params.exclude.join(","));
  if (params.search) sp.set("search", params.search);
  if (params.embed !== false) sp.set("_embed", "1");
  return (await wpFetch<WPPost[]>(`/posts?${sp.toString()}`)) ?? [];
}

export async function getPostsWithTotal(
  params: Parameters<typeof getPosts>[0] = {},
): Promise<{ posts: WPPost[]; totalPages: number; total: number }> {
  const sp = new URLSearchParams();
  sp.set("per_page", String(params.perPage ?? 12));
  if (params.page) sp.set("page", String(params.page));
  if (params.categories) {
    sp.set(
      "categories",
      Array.isArray(params.categories)
        ? params.categories.join(",")
        : String(params.categories),
    );
  }
  if (params.search) sp.set("search", params.search);
  if (params.embed !== false) sp.set("_embed", "1");
  const url = `${WP_BASE}/posts?${sp.toString()}`;
  const stale = () =>
    serveStale<{ posts: WPPost[]; totalPages: number; total: number }>(url) ?? {
      posts: [],
      totalPages: 0,
      total: 0,
    };
  try {
    const res = await fetchWithRetry(url, {
      next: { revalidate: REVALIDATE },
      headers: WP_HEADERS,
    });
    if (!res.ok) {
      console.error(`[wpFetch] ${res.status} ${res.statusText} ${url}`);
      return stale();
    }
    const posts = (await res.json()) as WPPost[];
    const totalPages = Number(res.headers.get("x-wp-totalpages") || "0");
    const total = Number(res.headers.get("x-wp-total") || "0");
    const payload = { posts, totalPages, total };
    STALE_CACHE.set(url, { data: payload, at: Date.now() });
    return payload;
  } catch (err) {
    console.error(
      `[wpFetch] threw ${err instanceof Error ? err.message : err} ${url}`,
    );
    return stale();
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const sp = new URLSearchParams();
  sp.set("slug", slug);
  sp.set("_embed", "1");
  const data = await wpFetch<WPPost[]>(`/posts?${sp.toString()}`);
  return data && data.length ? data[0] : null;
}

// ---------- taxonomies ----------

export async function getCategoryBySlug(
  slug: string,
): Promise<WPCategory | null> {
  const data = await wpFetch<WPCategory[]>(
    `/categories?slug=${encodeURIComponent(slug)}`,
  );
  return data && data.length ? data[0] : null;
}

export async function getTagBySlug(slug: string): Promise<WPTag | null> {
  const data = await wpFetch<WPTag[]>(
    `/tags?slug=${encodeURIComponent(slug)}`,
  );
  return data && data.length ? data[0] : null;
}

export async function getPopularTags(perPage = 20): Promise<WPTag[]> {
  return (
    (await wpFetch<WPTag[]>(
      `/tags?orderby=count&order=desc&per_page=${perPage}`,
    )) ?? []
  );
}

// ---------- helpers ----------

export function featuredImage(post: WPPost): {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width?: number;
  height?: number;
} | null {
  const m = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!m) return null;
  const sizesObj = m.media_details?.sizes || {};

  // Prefer the largest size available. WP typically exposes:
  //   thumbnail (150), medium (300), medium_large (768), large (1024),
  //   1536x1536, 2048x2048, full (original).
  // We fall back gracefully through this list.
  const pick =
    sizesObj["2048x2048"] ||
    sizesObj["1536x1536"] ||
    sizesObj["full"] ||
    sizesObj["large"] ||
    sizesObj["medium_large"] ||
    sizesObj["medium"];

  // Build a srcset from every size we have, but only include entries
  // whose aspect ratio roughly matches the original upload. WP generates
  // a lot of weird crops (square thumbs, portrait gallery crops, theme-
  // specific crops) that would otherwise confuse the browser — it picks
  // by width alone and would happily serve a 150x150 square into a
  // 16:9 slot, producing a squashed image.
  const fullWidth = m.media_details?.width;
  const fullHeight = m.media_details?.height;
  const baseRatio =
    fullWidth && fullHeight ? fullWidth / fullHeight : undefined;
  const RATIO_TOL = 0.05; // within 5% of original aspect

  const candidates: Array<{ url: string; w: number }> = [];
  for (const s of Object.values(sizesObj)) {
    if (!s || !s.source_url || !s.width || !s.height) continue;
    if (baseRatio !== undefined) {
      const r = s.width / s.height;
      if (Math.abs(r - baseRatio) / baseRatio > RATIO_TOL) continue;
    }
    candidates.push({ url: s.source_url, w: s.width });
  }
  // Include the original (`source_url`) as a candidate too — this is
  // usually the biggest image available.
  if (m.source_url && fullWidth) {
    if (!candidates.some((c) => c.url === m.source_url)) {
      candidates.push({ url: m.source_url, w: fullWidth });
    }
  }
  // De-dupe by width and sort ascending (srcset requirement).
  const uniq = new Map<number, string>();
  for (const c of candidates) if (!uniq.has(c.w)) uniq.set(c.w, c.url);
  const sorted = [...uniq.entries()].sort((a, b) => a[0] - b[0]);
  const srcSet = sorted.length
    ? sorted.map(([w, url]) => `${url} ${w}w`).join(", ")
    : undefined;

  return {
    src: pick?.source_url || m.source_url,
    srcSet,
    // Reasonable default — callers (hero, card) can override via their own sizes attr.
    sizes: "(min-width: 1024px) 900px, (min-width: 640px) 80vw, 100vw",
    alt: m.alt_text || "",
    width: pick?.width,
    height: pick?.height,
  };
}

export function postCategories(
  post: WPPost,
): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.["wp:term"] || [];
  for (const group of terms) {
    if (group?.[0]?.taxonomy === "category") {
      return group.map((t) => ({ id: t.id, name: t.name, slug: t.slug }));
    }
  }
  return [];
}

export function postTags(
  post: WPPost,
): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.["wp:term"] || [];
  for (const group of terms) {
    if (group?.[0]?.taxonomy === "post_tag") {
      return group.map((t) => ({ id: t.id, name: t.name, slug: t.slug }));
    }
  }
  return [];
}

export function postAuthor(
  post: WPPost,
): { name: string; slug: string; avatar?: string } | null {
  const a = post._embedded?.author?.[0];
  if (!a) return null;
  const avatars = a.avatar_urls || {};
  return {
    name: a.name,
    slug: a.slug || "",
    avatar: avatars["96"] || avatars["48"] || avatars["24"],
  };
}

// A tiny HTML entity decoder that covers WordPress output. Handles:
//   - Named entities (amp, quot, nbsp, lt, gt, apos, hellip, ndash, mdash,
//     lsquo, rsquo, ldquo, rdquo, laquo, raquo, copy, reg, trade)
//   - Numeric entities `&#NNN;` (decimal) and `&#xHH;` (hex), including
//     anything outside the BMP so emoji and Thai combining marks survive.
// WordPress loves to emit things like `&#8211;` for an en-dash or
// `&#8217;` for a curly apostrophe — we need to normalise ALL of these
// everywhere we render user-facing text (titles, excerpts, card labels).
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  laquo: "«",
  raquo: "»",
  copy: "©",
  reg: "®",
  trade: "™",
  middot: "·",
  bull: "•",
  deg: "°",
  times: "×",
  divide: "÷",
};

export function decodeEntities(input: string): string {
  if (!input) return "";
  return input.replace(
    /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]{1,31});/g,
    (match, body: string) => {
      if (body[0] === "#") {
        const code =
          body[1] === "x" || body[1] === "X"
            ? parseInt(body.slice(2), 16)
            : parseInt(body.slice(1), 10);
        if (!Number.isFinite(code) || code < 0) return match;
        try {
          return String.fromCodePoint(code);
        } catch {
          return match;
        }
      }
      const named = NAMED_ENTITIES[body];
      return named ?? match;
    },
  );
}

// Strip HTML tags, decode entities, collapse whitespace, optionally
// truncate. Used everywhere we need plain text for card excerpts.
export function stripHtml(s: string, max = 160): string {
  if (!s) return "";
  const txt = decodeEntities(s.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  if (txt.length <= max) return txt;
  return txt.slice(0, max).trimEnd() + "…";
}

// Turn a mangozero.com absolute URL into a site-local path so our Next
// router handles it. Preserves query/hash, returns input if not matching.
export function localizeLink(link: string): string {
  try {
    const u = new URL(link);
    if (u.hostname.endsWith("mangozero.com")) {
      return u.pathname + u.search + u.hash;
    }
  } catch {
    /* ignore */
  }
  return link;
}

// Format a post date in Thai-friendly short form.
export function formatThaiDate(iso: string): string {
  try {
    const d = new Date(iso);
    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const day = d.getDate();
    const m = months[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${m} ${year}`;
  } catch {
    return "";
  }
}
