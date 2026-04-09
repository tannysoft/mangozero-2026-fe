import Link from "next/link";
import {
  WPPost,
  decodeEntities,
  featuredImage,
  formatThaiDate,
  localizeLink,
  postCategories,
  stripHtml,
} from "@/lib/wp";
import { colorFor, findNavById } from "@/lib/categories";

type Variant = "default" | "compact" | "wide" | "tall" | "mini";

export function ArticleCard({
  post,
  variant = "default",
  rotate,
}: {
  post: WPPost;
  variant?: Variant;
  /** Optional rotation in degrees for that "sticker on a wall" vibe. */
  rotate?: number;
}) {
  const img = featuredImage(post);
  const href = localizeLink(post.link);
  const title = decodeEntities(post.title.rendered);
  const cats = postCategories(post);
  const primary = cats[0];
  const nav = primary ? findNavById(primary.id) : undefined;
  const tint = nav
    ? { bg: nav.color, text: nav.text }
    : primary
      ? colorFor(primary.id)
      : { bg: "bg-[#ffd60a]", text: "text-black" };

  const rotateStyle =
    rotate !== undefined ? { transform: `rotate(${rotate}deg)` } : undefined;

  if (variant === "mini") {
    return (
      <Link
        href={href}
        style={rotateStyle}
        className="card-chunk group block overflow-hidden"
      >
        <div className="flex gap-3 p-3">
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img.src}
              srcSet={img.srcSet}
              sizes="120px"
              alt={img.alt || title}
              className="h-20 w-24 flex-shrink-0 rounded-lg border-2 border-black object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="min-w-0 flex-1">
            {primary && (
              <span
                className={`inline-block rounded-full border border-black ${tint.bg} ${tint.text} px-2 py-[1px] text-[10px] font-black uppercase`}
              >
                {primary.name}
              </span>
            )}
            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-[1.45] group-hover:underline">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "wide") {
    return (
      <Link
        href={href}
        style={rotateStyle}
        className="card-chunk group flex flex-col overflow-hidden md:flex-row"
      >
        {img && (
          <div className="relative md:w-[55%] md:flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              srcSet={img.srcSet}
              sizes="(min-width: 1024px) 700px, (min-width: 768px) 55vw, 100vw"
              alt={img.alt || title}
              className="h-64 w-full object-cover md:h-full md:min-h-[360px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {cats.slice(0, 2).map((c) => {
              const n = findNavById(c.id);
              const col = n ? { bg: n.color, text: n.text } : colorFor(c.id);
              return (
                <span
                  key={c.id}
                  className={`rounded-full border-2 border-black ${col.bg} ${col.text} px-2 py-[2px] text-[10px] font-black uppercase shadow-[2px_2px_0_0_#121212]`}
                >
                  {c.name}
                </span>
              );
            })}
          </div>
          <h3 className="mt-3 text-2xl font-black leading-[1.3] group-hover:underline md:text-3xl md:leading-[1.25]">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-black/65">
            {stripHtml(post.excerpt.rendered, 160)}
          </p>
          <div className="mt-3 text-xs font-bold text-black/50">
            {formatThaiDate(post.date)}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "tall") {
    return (
      <Link
        href={href}
        style={rotateStyle}
        className="card-chunk group flex h-full flex-col overflow-hidden"
      >
        {img && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              srcSet={img.srcSet}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              alt={img.alt || title}
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {primary && (
              <span
                className={`absolute left-3 top-3 rounded-full border-2 border-black ${tint.bg} ${tint.text} px-3 py-1 text-[11px] font-black uppercase shadow-[2px_2px_0_0_#121212]`}
              >
                {primary.name}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-3 text-lg font-black leading-[1.45] group-hover:underline">
            {title}
          </h3>
          <div className="mt-auto pt-3 text-xs font-bold text-black/50">
            {formatThaiDate(post.date)}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={href}
        style={rotateStyle}
        className="card-chunk group block h-full overflow-hidden"
      >
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
            alt={img.alt || title}
            className="aspect-video w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="p-4">
          {primary && (
            <span
              className={`inline-block rounded-full border-2 border-black ${tint.bg} ${tint.text} px-2 py-[2px] text-[10px] font-black uppercase shadow-[2px_2px_0_0_#121212]`}
            >
              {primary.name}
            </span>
          )}
          <h3 className="mt-2 line-clamp-2 text-base font-black leading-[1.45] group-hover:underline">
            {title}
          </h3>
          <div className="mt-2 text-xs font-bold text-black/50">
            {formatThaiDate(post.date)}
          </div>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link
      href={href}
      style={rotateStyle}
      className="card-chunk group flex h-full flex-col overflow-hidden"
    >
      {img && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="(min-width: 1024px) 720px, (min-width: 640px) 90vw, 100vw"
            alt={img.alt || title}
            className="aspect-[16/10] w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {primary && (
            <span
              className={`absolute left-3 top-3 rounded-full border-2 border-black ${tint.bg} ${tint.text} px-3 py-1 text-[11px] font-black uppercase shadow-[2px_2px_0_0_#121212]`}
            >
              {primary.name}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-3 text-lg font-black leading-[1.45] group-hover:underline">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-black/60">
          {stripHtml(post.excerpt.rendered, 140)}
        </p>
        <div className="mt-auto pt-3 text-xs font-bold text-black/50">
          {formatThaiDate(post.date)}
        </div>
      </div>
    </Link>
  );
}
