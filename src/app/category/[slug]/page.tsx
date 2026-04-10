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
  color: string;
  text: string;
} | null> {
  const nav = findNavBySlug(slug);
  if (nav) {
    return { id: nav.id, name: nav.name, color: nav.color, text: nav.text };
  }
  const cat: WPCategory | null = await getCategoryBySlug(slug);
  if (!cat) return null;
  return { id: cat.id, name: cat.name, color: "bg-[#121212]", text: "text-white" };
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
      {/* Category header */}
      <div className="mb-10">
        <div
          className={`inline-flex items-center rounded-md ${cat.color} ${cat.text} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider`}
        >
          หมวดหมู่
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold leading-[1.2] sm:text-5xl sm:leading-[1.15]">
          {cat.name}
        </h1>
        <p className="mt-2 text-sm text-black/50">
          รวมข่าว บทความ และเรื่องราวทั้งหมดในหมวด {cat.name}
        </p>
      </div>

      {/* Category chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {NAV_CATEGORIES.map((c) => {
          const active = c.slug === slug;
          return (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-85 ${
                active
                  ? `${c.color} ${c.text}`
                  : "bg-[#f0f0f0] text-black/60"
              }`}
            >
              {c.name}
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
        {(page === 1 ? rest : posts).map((p) => (
          <ArticleCard
            key={p.id}
            post={p}
            variant="compact"
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
              &larr; ก่อนหน้า
            </Link>
          )}
          <span className="rounded-full border border-[#d0d0d0] bg-white px-4 py-2 text-xs font-bold text-black/60">
            {page} / {totalPages}
          </span>
          {page < totalPages && page < 50 && (
            <Link
              href={`/category/${slug}?page=${page + 1}`}
              className="btn-chunk text-xs"
            >
              ถัดไป &rarr;
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
