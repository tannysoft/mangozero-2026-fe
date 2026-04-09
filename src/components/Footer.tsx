import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-black bg-[#121212] text-[#fff8ea]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="h-10 w-auto" monoColor="#eba121" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            สำนักข่าวไม่เป็นทางการสำหรับ Gen Y & Gen Z
            เสิร์ฟข่าวไอดอล ดนตรี ซีรีส์ หนัง ไลฟ์สไตล์ เทรนด์โซเชียล
            แบบไม่ต้องซีเรียส. สนุกได้ทุกวัน แซ่บได้ทุกคลิก 🥭
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
                className="rounded-full border-2 border-[#eba121] bg-transparent px-3 py-1 text-xs font-bold text-[#eba121] hover:bg-[#eba121] hover:text-black"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black text-[#eba121] uppercase tracking-wider">
            หมวดหมู่สุดมันส์
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="inline-flex items-center gap-1 text-white/80 hover:text-[#ffd60a]"
                >
                  <span>{c.emoji}</span> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-black text-[#eba121] uppercase tracking-wider">
            เมนูลัด
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[#ffd60a]">
                หน้าแรก
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-[#ffd60a]">
                ค้นหา
              </Link>
            </li>
            <li>
              <a
                href="https://www.mangozero.com/about/"
                className="hover:text-[#ffd60a]"
              >
                เกี่ยวกับเรา
              </a>
            </li>
            <li>
              <a
                href="https://www.mangozero.com/contact/"
                className="hover:text-[#ffd60a]"
              >
                ติดต่อโฆษณา
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} Mango Zero — ไม่มีอะไร นอกจากเรื่องมันส์ๆ</div>
          <div>Built with Next.js + Tailwind • Data by WordPress REST</div>
        </div>
      </div>
    </footer>
  );
}
