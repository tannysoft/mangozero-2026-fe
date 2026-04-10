import Link from "next/link";
import {
  getPosts,
  decodeEntities,
  featuredImage,
  localizeLink,
  postCategories,
  stripHtml,
} from "@/lib/wp";
import { NAV_CATEGORIES, findNavById } from "@/lib/categories";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Marquee } from "@/components/Marquee";
import { HeroSlider } from "@/components/HeroSlider";

export const revalidate = 300;

const FEATURED_SECTIONS: Array<{
  slug: string;
  title: string;
  color: string;
  label: string;
}> = [
  {
    slug: "k-pop",
    title: "K-POP อัปเดตไอดอลที่คุณตามอยู่",
    color: "bg-[#c254a5]",
    label: "K-POP",
  },
  {
    slug: "series",
    title: "ซีรีส์ & ภาพยนตร์แนะนำ",
    color: "bg-[#1a9fc7]",
    label: "SERIES",
  },
  {
    slug: "social",
    title: "เทรนด์โซเชียลที่กำลังพูดถึง",
    color: "bg-[#d14832]",
    label: "TRENDING",
  },
  {
    slug: "lifestyle",
    title: "ไลฟ์สไตล์ที่น่าจับตา",
    color: "bg-[#2eb872]",
    label: "LIFESTYLE",
  },
];

export default async function HomePage() {
  const latestP = getPosts({ perPage: 13 });
  const kpopP = getPosts({ perPage: 6, categories: 659 });
  const seriesP = getPosts({ perPage: 6, categories: 191 });
  const socialP = getPosts({ perPage: 6, categories: 31 });
  const lifestyleP = getPosts({ perPage: 6, categories: 82 });
  const musicP = getPosts({ perPage: 4, categories: 318 });
  const moviesP = getPosts({ perPage: 4, categories: 99 });
  const gameP = getPosts({ perPage: 4, categories: 335 });

  const [latest, kpop, series, social, lifestyle, music, movies, game] =
    await Promise.all([
      latestP,
      kpopP,
      seriesP,
      socialP,
      lifestyleP,
      musicP,
      moviesP,
      gameP,
    ]);

  const heroSlides = latest.slice(0, 5);
  const heroSide = latest.slice(5, 9);
  const latestRest = latest.slice(5, 13);

  const sectionsMap: Record<string, typeof latest> = {
    "k-pop": kpop,
    series,
    social,
    lifestyle,
  };

  const marqueeItems = latest.slice(0, 8);

  return (
    <div>
      {/* ============ TICKER ============ */}
      <div className="border-b border-[#e0e0e0] bg-[#121212]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2.5 sm:px-6">
          <span className="rounded-md bg-[#e8265a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Now
          </span>
          <Marquee className="flex-1">
            {marqueeItems.map((p) => (
              <Link
                key={p.id}
                href={localizeLink(p.link)}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                <span className="mr-2 text-white/30">|</span>
                {decodeEntities(p.title.rendered)}
              </Link>
            ))}
          </Marquee>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="mx-auto max-w-[1280px] px-4 pb-4 pt-8 sm:px-6 sm:pt-12">

        {heroSlides.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-8">
              <HeroSlider
                slides={heroSlides.map((p) => {
                  const img = featuredImage(p);
                  const cats = postCategories(p);
                  return {
                    id: p.id,
                    href: localizeLink(p.link),
                    title: decodeEntities(p.title.rendered),
                    excerpt: stripHtml(p.excerpt.rendered, 160),
                    category: cats[0]?.name,
                    img: img ? { src: img.src, srcSet: img.srcSet } : undefined,
                  };
                })}
              />
            </div>

            <div className="card-chunk lg:col-span-4 flex flex-col divide-y divide-[#e8e8e8] overflow-hidden">
              <div className="flex items-center justify-between bg-[#121212] px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  ห้ามพลาด
                </span>
                <Link
                  href="/category/entertainment"
                  className="text-[10px] font-medium uppercase text-white/50 hover:text-white"
                >
                  ดูทั้งหมด →
                </Link>
              </div>
              {heroSide.map((p, i) => (
                <HeroSideItem key={p.id} post={p} index={i + 1} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="card-chunk p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold">เลือกหมวดที่สนใจ</h2>
          <div className="flex flex-wrap gap-2">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={`${c.color} ${c.text} inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-85`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LATEST ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        <SectionHeading
          label="LATEST"
          title="ข่าวล่าสุด"
          color="bg-[#121212]"
          href="/category/entertainment"
        >
          อัปเดตสดจากทุกหมวด
        </SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {latestRest.map((p) => (
            <ArticleCard key={p.id} post={p} variant="compact" />
          ))}
        </div>
      </section>

      {/* ============ SECTIONS ============ */}
      {FEATURED_SECTIONS.map((s, idx) => {
        const posts = sectionsMap[s.slug] || [];
        if (!posts.length) return null;
        const [feature, ...rest] = posts;
        return (
          <section
            key={s.slug}
            className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6"
          >
            <SectionHeading
              label={s.label}
              title={s.title}
              color={s.color}
              href={`/category/${s.slug}`}
            />

            {idx % 2 === 0 ? (
              <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
                <div className="flex lg:col-span-7">
                  {feature && <FeatureStretchCard post={feature} />}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
                  {rest.slice(0, 4).map((p) => (
                    <ArticleCard key={p.id} post={p} variant="compact" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 6).map((p) => (
                  <ArticleCard
                    key={p.id}
                    post={p}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* ============ POP CULTURE TRIO ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <SectionHeading
          label="CULTURE"
          title="เพลง · หนัง · เกม"
          color="bg-[#7c4dcc]"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <PopColumn
            label="เพลง"
            color="bg-[#7c4dcc] text-white"
            href="/category/music"
            posts={music}
          />
          <PopColumn
            label="หนัง"
            color="bg-[#d4a017] text-white"
            href="/category/movies"
            posts={movies}
          />
          <PopColumn
            label="เกม"
            color="bg-[#2d9e5a] text-white"
            href="/category/game"
            posts={game}
          />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="card-chunk p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-md bg-[#e8265a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Follow Us
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.3] sm:text-4xl sm:leading-[1.25]">
              ไม่อยากพลาดคอนเทนต์ดีๆ?
              <br />
              ตามเราได้ทุกช่องทาง
            </h2>
            <p className="mt-2 text-sm text-black/50">
              Facebook, Instagram, TikTok, X, YouTube — อัปเดตให้วันละหลายรอบ
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { label: "Facebook", href: "https://facebook.com/mangozero", color: "bg-[#3b5ccc]" },
                { label: "Instagram", href: "https://instagram.com/mangozero", color: "bg-[#d63864]" },
                { label: "TikTok", href: "https://tiktok.com/@mangozero", color: "bg-[#121212]" },
                { label: "X", href: "https://x.com/mangozero", color: "bg-[#333]" },
                { label: "YouTube", href: "https://youtube.com/@mangozero", color: "bg-[#d14832]" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className={`${s.color} rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-85`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------ local sub-components ------------ */

function FeatureStretchCard({
  post,
}: {
  post: Awaited<ReturnType<typeof getPosts>>[number];
}) {
  const img = featuredImage(post);
  const href = localizeLink(post.link);
  const title = decodeEntities(post.title.rendered);
  const cats = postCategories(post);
  const primary = cats[0];
  const nav = primary ? findNavById(primary.id) : undefined;
  const tint = nav
    ? { bg: nav.color, text: nav.text }
    : { bg: "bg-[#d4a017]", text: "text-white" };
  return (
    <Link
      href={href}
      className="card-chunk group relative flex w-full flex-col overflow-hidden lg:block lg:h-full lg:min-h-[520px]"
    >
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="(min-width: 1024px) 720px, 100vw"
          alt={img.alt || title}
          decoding="async"
          className="aspect-[16/10] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:transition-transform lg:duration-500 lg:group-hover:scale-[1.02]"
        />
      )}
      <div className="flex flex-1 flex-col p-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-gradient-to-t lg:from-black/85 lg:via-black/30 lg:to-transparent lg:p-7">
        {primary && (
          <span
            className={`inline-flex w-fit items-center rounded-md ${tint.bg} ${tint.text} px-2.5 py-1 text-[11px] font-bold uppercase lg:bg-white/20 lg:text-white lg:backdrop-blur-sm`}
          >
            {primary.name}
          </span>
        )}
        <h3 className="mt-3 line-clamp-3 text-2xl font-extrabold leading-[1.3] group-hover:underline md:text-3xl md:leading-[1.25] lg:text-white">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-black/50 lg:text-white/70">
          {stripHtml(post.excerpt.rendered, 160)}
        </p>
      </div>
    </Link>
  );
}

function HeroSideItem({
  post,
  index,
}: {
  post: Awaited<ReturnType<typeof getPosts>>[number];
  index: number;
}) {
  const img = featuredImage(post);
  const href = localizeLink(post.link);
  const title = decodeEntities(post.title.rendered);
  const cats = postCategories(post);
  const primary = cats[0];
  return (
    <Link
      href={href}
      className="group flex flex-1 items-center gap-3 bg-white p-3 transition-colors hover:bg-[#f5f5f5]"
    >
      <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#121212] text-[10px] font-bold text-white">
        {index}
      </span>
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="96px"
          alt={img.alt || title}
          className="h-16 w-20 flex-shrink-0 rounded-lg object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="min-w-0 flex-1">
        {primary && (
          <span className="text-[10px] font-bold uppercase text-[#d63864]">
            {primary.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-bold leading-[1.45] group-hover:underline">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function PopColumn({
  label,
  color,
  href,
  posts,
}: {
  label: string;
  color: string;
  href: string;
  posts: Awaited<ReturnType<typeof getPosts>>;
}) {
  return (
    <div className="card-chunk p-4">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`${color} inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase`}
        >
          {label}
        </span>
        <Link href={href} className="text-xs font-medium text-black/50 hover:text-black">
          ดูทั้งหมด →
        </Link>
      </div>
      <ul className="space-y-3">
        {posts.map((p, i) => {
          const thumb = featuredImage(p);
          return (
            <li key={p.id}>
              <Link
                href={localizeLink(p.link)}
                className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#f5f5f5]"
              >
                <div className="relative flex-shrink-0">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb.src}
                      srcSet={thumb.srcSet}
                      sizes="96px"
                      alt={thumb.alt || decodeEntities(p.title.rendered)}
                      className="h-[72px] w-[96px] rounded-lg object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="grid h-[72px] w-[96px] place-items-center rounded-lg bg-[#f0f0f0] text-sm text-black/30">
                      —
                    </div>
                  )}
                  <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#121212] text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="line-clamp-3 text-sm font-bold leading-[1.45] group-hover:underline">
                  {decodeEntities(p.title.rendered)}
                </h3>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
