"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV_CATEGORIES } from "@/lib/categories";

export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const ENTER = 120;
    const EXIT = 40;
    let ticking = false;
    let current = false;

    const evaluate = () => {
      const y = window.scrollY;
      if (!current && y > ENTER) {
        current = true;
        setCompact(true);
      } else if (current && y < EXIT) {
        current = false;
        setCompact(false);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(evaluate);
      }
    };

    current = window.scrollY > ENTER;
    setCompact(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-compact={compact ? "true" : "false"}
      className="sticky top-0 z-40 border-b border-[#e0e0e0] bg-white/95 backdrop-blur"
    >
      {/* Row 1: logo + search */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
          compact ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-auto sm:h-9" />
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-black/40 sm:inline-block">
              est. zero
            </span>
          </Link>

          <form
            action="/search"
            className="ml-auto hidden w-full max-w-sm items-center gap-2 rounded-full border border-[#d0d0d0] bg-[#f5f5f5] px-4 py-2 md:flex"
          >
            <svg className="h-4 w-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="ค้นหาไอดอล ซีรีส์ เทรนด์..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-black/40"
            />
            <button
              type="submit"
              className="rounded-full bg-[#121212] px-3 py-1 text-xs font-bold uppercase text-white"
            >
              Go
            </button>
          </form>

          <Link
            href="/search"
            aria-label="Search"
            className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-[#d0d0d0] bg-[#f5f5f5] md:hidden"
          >
            <svg className="h-4 w-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Row 2: category rail */}
      <nav
        className={`transition-colors ${
          compact ? "bg-white" : "border-t border-[#e0e0e0] bg-[#fafafa]"
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2 sm:px-6">
          {/* Mini logo — only visible in compact mode */}
          <Link
            href="/"
            aria-label="Mango Zero"
            className={`flex shrink-0 items-center overflow-hidden transition-[width,opacity,margin] duration-200 ${
              compact ? "w-[110px] opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Logo className="h-7 w-auto" />
          </Link>

          <ul className="no-scrollbar flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
            {!compact && (
              <li className="shrink-0">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#121212] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  หน้าแรก
                </Link>
              </li>
            )}
            {NAV_CATEGORIES.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link
                  href={`/category/${c.slug}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    c.color
                  } ${c.text}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search icon — only visible in compact mode */}
          <Link
            href="/search"
            aria-label="Search"
            className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-[#d0d0d0] bg-[#f5f5f5] transition-[width,opacity] duration-200 ${
              compact ? "h-8 w-8 opacity-100" : "h-0 w-0 border-0 opacity-0"
            }`}
          >
            <svg className="h-3.5 w-3.5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
