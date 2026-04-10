import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  decodeEntities,
  featuredImage,
  formatThaiDate,
  getPostBySlug,
  getPosts,
  localizeLink,
  postAuthor,
  postCategories,
  postTags,
  stripHtml,
} from "@/lib/wp";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { colorFor, findNavById } from "@/lib/categories";

export const revalidate = 300;

type Params = { slug: string[] };

async function resolvePost(slug: string[]) {
  const candidate = slug[slug.length - 1] || slug[0];
  return getPostBySlug(candidate);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return { title: "ไม่พบบทความ" };
  const title = decodeEntities(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered, 180);
  const img = featuredImage(post);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: img ? [{ url: img.src }] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  const img = featuredImage(post);
  const title = decodeEntities(post.title.rendered);
  const cats = postCategories(post);
  const tags = postTags(post);
  const author = postAuthor(post);
  const primary = cats[0];
  const nav = primary ? findNavById(primary.id) : undefined;
  const tint = nav
    ? { bg: nav.color, text: nav.text }
    : primary
      ? colorFor(primary.id)
      : { bg: "bg-[#eba121]", text: "text-white" };

  const relatedRaw = primary
    ? await getPosts({ perPage: 5, categories: primary.id, exclude: [post.id] })
    : [];
  const related = relatedRaw.slice(0, 4);

  return (
    <article className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
      {/* breadcrumb */}
      <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-black/40">
        <Link href="/" className="hover:text-black">
          หน้าแรก
        </Link>
        <span>/</span>
        {primary && (
          <Link
            href={`/category/${nav?.slug ?? primary.slug}`}
            className="font-medium text-[#eba121] hover:text-[#c97f00]"
          >
            {primary.name}
          </Link>
        )}
      </div>

      <header className="mb-6">
        <h1 className="font-[var(--font-display)] text-3xl font-extrabold leading-[1.35] sm:text-5xl sm:leading-[1.25]">
          {title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-black/50">
          {author && (
            <span className="inline-flex items-center gap-2">
              {author.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-7 w-7 rounded-full border border-[#e0e0e0]"
                />
              )}
              <span className="font-medium">{author.name}</span>
            </span>
          )}
          <span>&middot;</span>
          <time dateTime={post.date}>{formatThaiDate(post.date)}</time>
        </div>
      </header>

      {img && (
        <div className="card-chunk mb-8 overflow-hidden p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="(min-width: 1100px) 1100px, 100vw"
            alt={img.alt || title}
            className="w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      )}

      <div
        className="prose-mz"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* tags */}
      {tags.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-black/40">
            แท็ก:
          </span>
          {tags.map((t) => (
            <Link
              key={t.id}
              href={`/tag/${t.slug}`}
              className="rounded-lg bg-[#f0f0f0] px-3 py-1 text-xs font-medium text-black/60 transition-colors hover:bg-[#eba121] hover:text-white"
            >
              #{t.name}
            </Link>
          ))}
        </div>
      )}

      {/* share */}
      <div className="mt-10 card-chunk flex flex-wrap items-center gap-3 border-[#eba121]/30 bg-[#fffbf0] p-5">
        <span className="text-sm font-bold uppercase text-[#eba121]">แชร์บทความ</span>
        <div className="flex flex-wrap gap-2">
          <a
            className="btn-chunk text-xs"
            target="_blank"
            rel="noopener"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.link)}`}
          >
            Facebook
          </a>
          <a
            className="btn-chunk text-xs"
            target="_blank"
            rel="noopener"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(post.link)}&text=${encodeURIComponent(title)}`}
          >
            X
          </a>
          <a
            className="btn-chunk text-xs"
            target="_blank"
            rel="noopener"
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(post.link)}`}
          >
            LINE
          </a>
          <a
            className="btn-chunk text-xs"
            target="_blank"
            rel="noopener"
            href={localizeLink(post.link)}
          >
            คัดลอกลิงก์
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            label="RELATED"
            title="บทความที่เกี่ยวข้อง"
            color="bg-[#eba121]"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ArticleCard
                key={p.id}
                post={p}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
