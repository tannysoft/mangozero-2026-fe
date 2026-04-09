import type { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "ค้นหา",
};

export const revalidate = 60;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await getPosts({ search: query, perPage: 24 }) : [];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <div className="card-chunk mb-10 bg-[#00d4ff] p-6 sm:p-10">
        <div className="inline-flex rotate-[-2deg] items-center gap-1 rounded-full border-2 border-black bg-white px-3 py-1 text-[11px] font-black uppercase shadow-[3px_3px_0_0_#121212]">
          🔍 ค้นหา
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-black sm:text-6xl">
          หาเรื่องมันส์ๆ
        </h1>
        <form
          action="/search"
          className="mt-5 flex max-w-2xl items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_0_#121212]"
        >
          <span>🔍</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="ลองพิมพ์ชื่อไอดอล ซีรีส์ เพลง..."
            className="w-full bg-transparent text-base font-medium outline-none placeholder:text-black/40"
          />
          <button
            type="submit"
            className="rounded-full bg-black px-4 py-2 text-xs font-black text-[#ffd60a] uppercase"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {query && (
        <>
          <p className="mb-6 text-sm font-bold text-black/60">
            ผลการค้นหาสำหรับ{" "}
            <span className="rounded-md border-2 border-black bg-[#ffd60a] px-2 py-0.5 font-black text-black">
              {query}
            </span>{" "}
            — เจอ {results.length} เรื่อง
          </p>
          {results.length === 0 ? (
            <div className="card-chunk p-10 text-center">
              <div className="text-5xl">😬</div>
              <p className="mt-3 text-lg font-black">
                ไม่เจอเรื่องที่ค้นหาเลย ลองคำใหม่ดูนะ!
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => (
                <ArticleCard
                  key={p.id}
                  post={p}
                  variant="compact"
                  rotate={i % 2 === 0 ? -0.3 : 0.3}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
