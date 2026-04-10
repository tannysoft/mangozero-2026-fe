import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e0e0e0] bg-[#121212] text-[#f5f5f5]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="h-10 w-auto" monoColor="#eba121" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            สำนักข่าวไม่เป็นทางการสำหรับ Gen Y & Gen Z
            — เสิร์ฟข่าวไอดอล ดนตรี ซีรีส์ หนัง ไลฟ์สไตล์ เทรนด์โซเชียล
            สนุกได้ทุกวัน
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Facebook", href: "https://facebook.com/mangozero" },
              { label: "Instagram", href: "https://instagram.com/mangozero" },
              { label: "TikTok", href: "https://tiktok.com/@mangozero" },
              { label: "X", href: "https://x.com/mangozero" },
              { label: "YouTube", href: "https://youtube.com/@mangozero" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                rel="noopener"
                target="_blank"
                className="rounded-lg border border-white/20 bg-transparent px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#eba121]">
            หมวดหมู่
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#eba121]">
            เมนู
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-white/60 hover:text-white">
                หน้าแรก
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-white/60 hover:text-white">
                ค้นหา
              </Link>
            </li>
            <li>
              <a
                href="https://www.mangozero.com/about/"
                className="text-white/60 hover:text-white"
              >
                เกี่ยวกับเรา
              </a>
            </li>
            <li>
              <a
                href="https://www.mangozero.com/contact/"
                className="text-white/60 hover:text-white"
              >
                ติดต่อโฆษณา
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/35 sm:flex-row sm:px-6">
          <div>&copy; {new Date().getFullYear()} Mango Zero</div>
          <div>Built with Next.js + Tailwind &middot; Data by WordPress REST</div>
        </div>
      </div>
    </footer>
  );
}
