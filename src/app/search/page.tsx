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
      <div className="mb-10">
        <div className="inline-flex items-center rounded-md bg-[#121212] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#eba121]">
          ค้นหา
        </div>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-extrabold sm:text-5xl">
          ค้นหาบทความ
        </h1>
        <form
          action="/search"
          className="mt-5 flex max-w-2xl items-center gap-2 rounded-xl border border-[#d0d0d0] bg-white px-4 py-3 shadow-sm"
        >
          <svg className="h-5 w-5 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="พิมพ์ชื่อไอดอล ซีรีส์ เพลง..."
            className="w-full bg-transparent text-base font-medium outline-none placeholder:text-black/40"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#121212] px-4 py-2 text-xs font-bold uppercase text-[#eba121]"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {query && (
        <>
          <p className="mb-6 text-sm text-black/50">
            ผลการค้นหาสำหรับ{" "}
            <span className="font-bold text-black">
              {query}
            </span>{" "}
            — เจอ {results.length} เรื่อง
          </p>
          {results.length === 0 ? (
            <div className="card-chunk p-10 text-center">
              <p className="text-lg font-bold text-black/50">
                ไม่เจอเรื่องที่ค้นหา ลองคำใหม่ดู
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <ArticleCard
                  key={p.id}
                  post={p}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
