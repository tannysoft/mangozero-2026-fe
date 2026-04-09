import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getPostsWithTotal,
  type WPCategory,
} from "@/lib/wp";
import { ArticleCard } from "@/components/ArticleCard";
import { findNavBySlug, NAV_CATEGORIES } from "@/lib/categories";

export const revalidate = 300;

type Params = { slug: string };
type Search = { page?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nav = findNavBySlug(slug);
  const name = nav?.name ?? slug;
  return {
    title: `${name} — รวมข่าวและบทความทั้งหมด`,
    description: `อ่านข่าวและบทความหมวด ${name} ล่าสุดจาก Mango Zero`,
  };
}

async function resolveCategory(slug: string): Promise<{
  id: number;
  name: string;
  emoji?: string;
  color: string;
} | null> {
  const nav = findNavBySlug(slug);
  if (nav) {
    return { id: nav.id, name: nav.name, emoji: nav.emoji, color: nav.color };
  }
  const cat: WPCategory | null = await getCategoryBySlug(slug);
  if (!cat) return null;
  return { id: cat.id, name: cat.name, color: "bg-[#ffd60a]" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page || "1") || 1);

  const cat = await resolveCategory(slug);
  if (!cat) notFound();

  // perPage chosen so the grid always fills evenly:
  //   page 1 → 1 featured (wide) + 15 compact (3 cols × 5 rows)
  //   page 2+ → 15 compact (3 cols × 5 rows), no featured
  // Bumping this past 16 would need an extra filler card on p2+ to
  // avoid a lonely last row.
  const perPage = page === 1 ? 16 : 15;
  const { posts, totalPages } = await getPostsWithTotal({
    categories: cat.id,
    perPage,
    page,
  });

  if (page === 1 && posts.length === 0) notFound();

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      {/* Category hero banner */}
      <div
        className={`card-chunk relative mb-10 overflow-hidden p-6 sm:p-10 ${cat.color}`}
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-[11px] font-black uppercase shadow-[3px_3px_0_0_#121212]">
            📂 หมวดหมู่
          </div>
          <h1 className="mt-3 font-[var(--font-display)] text-5xl font-black leading-[1.2] sm:text-7xl sm:leading-[1.15]">
            {cat.emoji && <span className="mr-3">{cat.emoji}</span>}
            {cat.name}
          </h1>
          <p className="mt-3 text-sm font-bold text-black/70">
            รวมข่าว บทความ และเรื่องมันส์ๆ ทั้งหมดในหมวด {cat.name}
          </p>
        </div>
        <div className="pointer-events-none absolute -right-10 -bottom-10 text-[220px] opacity-10">
          🥭
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {NAV_CATEGORIES.map((c) => {
          const active = c.slug === slug;
          return (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className={`inline-flex items-center gap-1 rounded-full border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_0_#121212] ${
                active ? `${c.color} ${c.text}` : "bg-white text-black"
              }`}
            >
              <span>{c.emoji}</span> {c.name}
            </Link>
          );
        })}
      </div>

      {page === 1 && featured && (
        <div className="mb-10">
          <ArticleCard post={featured} variant="wide" />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(page === 1 ? rest : posts).map((p, i) => (
          <ArticleCard
            key={p.id}
            post={p}
            variant="compact"
            rotate={i % 2 === 0 ? -0.3 : 0.3}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/category/${slug}?page=${page - 1}`}
              className="btn-chunk text-xs"
            >
              ← ก่อนหน้า
            </Link>
          )}
          <span className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black shadow-[3px_3px_0_0_#121212]">
            {page} / {totalPages}
          </span>
          {page < totalPages && page < 50 && (
            <Link
              href={`/category/${slug}?page=${page + 1}`}
              className="btn-chunk text-xs"
            >
              ถัดไป →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
