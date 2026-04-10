import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPosts, getTagBySlug } from "@/lib/wp";
import { ArticleCard } from "@/components/ArticleCard";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));
  return {
    title: tag ? `#${tag.name}` : `แท็ก`,
    description: tag ? `รวมบทความที่เกี่ยวกับ ${tag.name}` : undefined,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));
  if (!tag) notFound();

  const posts = await getPosts({ perPage: 24, tags: tag.id });

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <div className="mb-10">
        <div className="inline-flex items-center rounded-md bg-[#eba121] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          แท็ก
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold sm:text-5xl">
          #{tag.name}
        </h1>
        <p className="mt-2 text-sm text-black/50">
          {tag.count} บทความ
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-lg font-bold text-black/50">
          ยังไม่มีบทความในแท็กนี้
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <ArticleCard
              key={p.id}
              post={p}
              variant="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
}
