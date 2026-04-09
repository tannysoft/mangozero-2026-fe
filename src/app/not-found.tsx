import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-20 text-center sm:px-6">
      <div className="card-chunk p-10 sm:p-16">
        <div className="text-7xl wiggle">🥭</div>
        <h1 className="mt-4 font-[var(--font-display)] text-6xl font-black sm:text-8xl">
          404
        </h1>
        <p className="mt-2 text-xl font-black">
          อ่าว... หน้านี้หายไปกับเทรนด์เมื่อวาน
        </p>
        <p className="mt-2 text-sm text-black/60">
          ลองกดกลับหน้าแรก หรือไปดูข่าวสนุกๆ หมวดอื่นดีกว่า
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-chunk text-xs uppercase">
            ← กลับหน้าแรก
          </Link>
          <Link
            href="/category/entertainment"
            className="btn-chunk bg-[#ff2d87] text-xs uppercase text-white"
          >
            ดูข่าวบันเทิง
          </Link>
        </div>
      </div>
    </div>
  );
}
