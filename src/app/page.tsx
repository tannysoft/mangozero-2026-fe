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

export const revalidate = 300;

// A compact curated set of the most-loved verticals we want to feature
// on the home page under their own headings, in visual order.
const FEATURED_SECTIONS: Array<{
  slug: string;
  title: string;
  emoji: string;
  color: string;
  label: string;
}> = [
  {
    slug: "k-pop",
    title: "K-POP ซ่ามาก ใครเฟนใครได้เวลาปรบมือ",
    emoji: "💜",
    color: "bg-[#ff6bd6]",
    label: "K-POP ZONE",
  },
  {
    slug: "series",
    title: "ซีรีส์ & หนัง ห้ามพลาดคืนนี้",
    emoji: "📺",
    color: "bg-[#00d4ff]",
    label: "BINGE LIST",
  },
  {
    slug: "social",
    title: "เทรนด์โซเชียลเดือดๆ ที่กำลังไวรัล",
    emoji: "🔥",
    color: "bg-[#ff5e3a]",
    label: "NOW TRENDING",
  },
  {
    slug: "lifestyle",
    title: "ไลฟ์สไตล์วัยรุ่นต้องจด",
    emoji: "✨",
    color: "bg-[#7cf3a7]",
    label: "VIBE CHECK",
  },
];

export default async function HomePage() {
  // Fire off all data fetches in parallel to keep the home TTFB snappy.
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

  // Split "latest" into the hero bento and a rail below it.
  const hero = latest[0];
  const heroSide = latest.slice(1, 5);
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
      {/* ============ TICKER / BREAKING ============ */}
      <div className="border-b-2 border-black bg-[#121212]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:px-6">
          <span className="rounded-full bg-[#ff2d87] px-3 py-1 text-[11px] font-black uppercase text-white shadow-[2px_2px_0_0_#ffd60a]">
            ● เทรนด์ตอนนี้
          </span>
          <Marquee className="flex-1">
            {marqueeItems.map((p) => (
              <Link
                key={p.id}
                href={localizeLink(p.link)}
                className="text-sm font-bold text-white/90 hover:text-[#ffd60a]"
              >
                <span className="mr-2 text-[#ffd60a]">★</span>
                {decodeEntities(p.title.rendered)}
              </Link>
            ))}
          </Marquee>
        </div>
      </div>

      {/* ============ HERO — BENTO GRID ============ */}
      <section className="mx-auto max-w-[1280px] px-4 pb-4 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-black bg-[#ffd60a] px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_0_#121212]">
              🥭 MANGO ZERO DAILY DROP
            </div>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl font-black leading-[1.35] sm:text-5xl sm:leading-[1.3] md:text-6xl md:leading-[1.25]">
              ข่าวที่{" "}
              <span className="inline-block rounded-xl bg-[#ff2d87] px-3 py-1 text-white shadow-[4px_4px_0_0_#121212]">
                สนุก
              </span>
              <br />
              กว่าคอมเมนต์ใต้โพสต์
            </h1>
            <p className="mt-3 max-w-xl text-base font-medium text-black/65">
              Thai POP • K-POP • J-POP • ซีรีส์ • หนัง • โซเชียล • เทรนด์.
              เสิร์ฟตรงจากเตาสำหรับ Gen Y & Gen Z
            </p>
          </div>
          <Link href="/category/entertainment" className="btn-chunk">
            ✨ เริ่มมันส์ตรงนี้
          </Link>
        </div>

        {hero && (
          <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
            {/* big hero card */}
            <div className="lg:col-span-8">
              <HeroBigCard post={hero} />
            </div>

            {/* side rail: 4 mini cards in compact list style */}
            <div className="card-chunk lg:col-span-4 flex flex-col divide-y-2 divide-black/10 overflow-hidden">
              <div className="flex items-center justify-between bg-[#121212] px-4 py-3 text-[#ffd60a]">
                <span className="inline-flex items-center gap-1 text-xs font-black uppercase">
                  ⚡ ห้ามพลาด
                </span>
                <Link
                  href="/category/entertainment"
                  className="text-[10px] font-bold uppercase text-white/70 hover:text-[#ffd60a]"
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

      {/* ============ CATEGORY STICKERS ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="card-chunk p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-black uppercase">เลือกหมวดที่ใช่</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {NAV_CATEGORIES.map((c, i) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={`${c.color} ${c.text} inline-flex items-center gap-2 rounded-2xl border-2 border-black px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0_0_#121212] transition-transform hover:translate-y-[-2px]`}
                style={{ transform: `rotate(${(i % 5) - 2}deg)` }}
              >
                <span className="text-lg">{c.emoji}</span> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LATEST RAIL ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        <SectionHeading
          emoji="⚡"
          label="FRESH DROP"
          title="ข่าวล่าสุด"
          color="bg-[#ffd60a]"
          href="/category/entertainment"
        >
          อัปเดตสด หมาดๆ ร้อนๆ จากทุกหมวด
        </SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {latestRest.map((p, i) => (
            <ArticleCard
              key={p.id}
              post={p}
              variant="compact"
              rotate={i % 2 === 0 ? -0.4 : 0.4}
            />
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
              emoji={s.emoji}
              label={s.label}
              title={s.title}
              color={s.color}
              href={`/category/${s.slug}`}
            />

            {/* Alternating layouts per section for visual variety. */}
            {idx % 2 === 0 ? (
              // "Hero + rail" — big feature card on the left, 4 compact
              // cards in a 2x2 on the right. On desktop we stretch the
              // feature card to match the rail height using an
              // absolute-positioned image (otherwise aspect-ratio would
              // force the feature taller than the rail).
              <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
                <div className="flex lg:col-span-7">
                  {feature && <FeatureStretchCard post={feature} />}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
                  {rest.slice(0, 4).map((p, i) => (
                    <ArticleCard
                      key={p.id}
                      post={p}
                      variant="compact"
                      rotate={i % 2 ? 0.4 : -0.4}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(0, 6).map((p, i) => (
                  <ArticleCard
                    key={p.id}
                    post={p}
                    variant={i === 0 ? "default" : "compact"}
                    rotate={i % 3 === 0 ? -0.3 : 0.3}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* ============ POP CULTURE TRIO: music / movies / game ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <SectionHeading
          emoji="🎛️"
          label="POP CULTURE"
          title="เพลง · หนัง · เกม รวมมิตรเอนเตอร์"
          color="bg-[#a066ff]"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <PopColumn
            label="เพลง"
            emoji="🎧"
            color="bg-[#a066ff] text-white"
            href="/category/music"
            posts={music}
          />
          <PopColumn
            label="หนัง"
            emoji="🎬"
            color="bg-[#ffd60a] text-black"
            href="/category/movies"
            posts={movies}
          />
          <PopColumn
            label="เกม"
            emoji="🎮"
            color="bg-[#39ff14] text-black"
            href="/category/game"
            posts={game}
          />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="card-chunk relative overflow-hidden p-8 sm:p-12">
          <div className="spin-slow pointer-events-none absolute -right-10 -top-10 text-[180px] opacity-10">
            🥭
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex rotate-[-2deg] rounded-full border-2 border-black bg-[#ff2d87] px-3 py-1 text-[11px] font-black uppercase text-white shadow-[3px_3px_0_0_#121212]">
              JOIN THE SQUAD
            </div>
            <h2 className="mt-3 text-3xl font-black leading-[1.3] sm:text-4xl sm:leading-[1.25]">
              ไม่อยากพลาด content มันส์ๆ?
              <br />
              ตามเราไปเลยทุกช่อง 🥭
            </h2>
            <p className="mt-2 text-sm text-black/65">
              กดติดตาม Facebook, Instagram, TikTok, X, YouTube เราอัปเดตให้วันละหลายรอบ
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { label: "Facebook", href: "https://facebook.com/mangozero", color: "bg-[#4c6fff] text-white" },
                { label: "Instagram", href: "https://instagram.com/mangozero", color: "bg-[#ff2d87] text-white" },
                { label: "TikTok", href: "https://tiktok.com/@mangozero", color: "bg-black text-white" },
                { label: "X / Twitter", href: "https://x.com/mangozero", color: "bg-[#ffd60a] text-black" },
                { label: "YouTube", href: "https://youtube.com/@mangozero", color: "bg-[#ff5e3a] text-white" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className={`${s.color} rounded-full border-2 border-black px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0_0_#121212] hover:translate-y-[-2px]`}
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

function HeroBigCard({
  post,
}: {
  post: Awaited<ReturnType<typeof getPosts>>[number];
}) {
  const img = featuredImage(post);
  const href = localizeLink(post.link);
  const title = decodeEntities(post.title.rendered);
  const cats = postCategories(post);
  const primary = cats[0];
  return (
    <Link
      href={href}
      className="card-chunk group relative block h-full min-h-[420px] overflow-hidden sm:min-h-[520px]"
    >
      {img && (
        // Full-bleed background image — absolute so it fills whatever
        // height the grid row decides, instead of using aspect-ratio
        // (which would leave empty whitespace).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="(min-width: 1024px) 900px, 100vw"
          alt={img.alt || title}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
      {/* gradient + title overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-black/0 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-[#ffd60a] px-3 py-1 text-[11px] font-black uppercase text-black shadow-[2px_2px_0_0_#121212]">
            ⭐ HERO OF THE DAY
          </span>
          {primary && (
            <span className="inline-flex items-center rounded-full border-2 border-white bg-[#ff2d87] px-3 py-1 text-[11px] font-black uppercase text-white">
              {primary.name}
            </span>
          )}
        </div>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-[1.3] text-white drop-shadow-[2px_2px_0_#000] sm:text-3xl sm:leading-[1.25] md:text-4xl">
          {title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm font-medium text-white/80">
          {stripHtml(post.excerpt.rendered, 160)}
        </p>
      </div>
    </Link>
  );
}

// Variant used in the idx=0 section layout. Behaves like a default card
// on mobile (image-on-top + text-below, so the image isn't squished), but
// on desktop collapses to a full-bleed image with an overlay caption so
// the card can stretch to match the neighbouring 2x2 rail height.
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
    : { bg: "bg-[#ffd60a]", text: "text-black" };
  return (
    <Link
      href={href}
      style={{ transform: "rotate(-0.3deg)" }}
      className="card-chunk group relative flex w-full flex-col overflow-hidden lg:block lg:h-full lg:min-h-[520px]"
    >
      {img && (
        // On mobile: normal aspect-ratio image on top.
        // On desktop: absolutely positioned full-bleed image so the card
        // can stretch to whatever height the grid row needs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="(min-width: 1024px) 720px, 100vw"
          alt={img.alt || title}
          decoding="async"
          className="aspect-[16/10] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:transition-transform lg:duration-500 lg:group-hover:scale-[1.03]"
        />
      )}
      {/* Caption — sits below image on mobile, overlays at the bottom on desktop. */}
      <div className="flex flex-1 flex-col p-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-gradient-to-t lg:from-black/90 lg:via-black/40 lg:to-transparent lg:p-7">
        {primary && (
          <span
            className={`inline-flex w-fit items-center rounded-full border-2 border-black ${tint.bg} ${tint.text} px-3 py-1 text-[11px] font-black uppercase shadow-[2px_2px_0_0_#121212] lg:border-white`}
          >
            {primary.name}
          </span>
        )}
        <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-[1.3] group-hover:underline md:text-3xl md:leading-[1.25] lg:text-white lg:drop-shadow-[2px_2px_0_#000]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-black/60 lg:text-white/80">
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
      className="group flex flex-1 items-center gap-3 bg-white p-3 transition-colors hover:bg-[#fff3cd]"
    >
      <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border-2 border-black bg-[#ffd60a] text-xs font-black">
        {index}
      </span>
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          srcSet={img.srcSet}
          sizes="96px"
          alt={img.alt || title}
          className="h-16 w-20 flex-shrink-0 rounded-lg border-2 border-black object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="min-w-0 flex-1">
        {primary && (
          <span className="text-[10px] font-black uppercase text-[#ff2d87]">
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
  emoji,
  color,
  href,
  posts,
}: {
  label: string;
  emoji: string;
  color: string;
  href: string;
  posts: Awaited<ReturnType<typeof getPosts>>;
}) {
  return (
    <div className="card-chunk p-4">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`${color} inline-flex items-center gap-1 rounded-full border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_0_#121212]`}
        >
          <span className="text-base">{emoji}</span> {label}
        </span>
        <Link href={href} className="text-xs font-bold underline">
          ดูทั้งหมด
        </Link>
      </div>
      <ul className="space-y-3">
        {posts.map((p, i) => {
          const thumb = featuredImage(p);
          return (
            <li key={p.id}>
              <Link
                href={localizeLink(p.link)}
                className="group flex items-center gap-3 rounded-xl border-2 border-transparent p-2 transition-colors hover:border-black hover:bg-[#fff8ea]"
              >
                <div className="relative flex-shrink-0">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb.src}
                      srcSet={thumb.srcSet}
                      sizes="96px"
                      alt={thumb.alt || decodeEntities(p.title.rendered)}
                      className="h-[72px] w-[96px] rounded-lg border-2 border-black object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="grid h-[72px] w-[96px] place-items-center rounded-lg border-2 border-black bg-[#ffd60a] text-2xl">
                      🥭
                    </div>
                  )}
                  <span className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-black bg-[#ffd60a] text-xs font-black shadow-[2px_2px_0_0_#121212]">
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
