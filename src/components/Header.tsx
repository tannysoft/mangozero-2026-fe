"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV_CATEGORIES } from "@/lib/categories";

export function Header() {
  // When the user scrolls down we collapse the two-row header into a
  // single compact row. To avoid flicker we:
  //   1. Render a single DOM structure and only toggle classes
  //      (never conditionally unmount rows — that would retrigger scroll
  //      events as the header height changes).
  //   2. Use hysteresis: enter compact at 120px, exit at 40px, so a
  //      reflow-induced scroll wobble can't bounce between states.
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

    // Initialise from current scroll position (e.g. after navigation).
    current = window.scrollY > ENTER;
    setCompact(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-compact={compact ? "true" : "false"}
      className="sticky top-0 z-40 border-b-2 border-black bg-[#fff8ea]/95 backdrop-blur"
    >
      {/* Row 1: logo + search. Collapses to zero height in compact mode. */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
          compact ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="wiggle">
              <Logo className="h-8 w-auto sm:h-9" />
            </div>
            <span className="ml-1 hidden rounded-full border-2 border-black bg-[#ff2d87] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[2px_2px_0_0_#121212] sm:inline-block">
              est. zero
            </span>
          </Link>

          <form
            action="/search"
            className="ml-auto hidden w-full max-w-sm items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0_0_#121212] md:flex"
          >
            <span aria-hidden>🔍</span>
            <input
              type="search"
              name="q"
              placeholder="ค้นหาไอดอล ซีรีส์ เทรนด์..."
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-black/40"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-3 py-1 text-xs font-black uppercase text-[#ffd60a]"
            >
              Go
            </button>
          </form>

          <Link
            href="/search"
            aria-label="Search"
            className="ml-auto grid h-10 w-10 place-items-center rounded-full border-2 border-black bg-white text-lg shadow-[3px_3px_0_0_#121212] md:hidden"
          >
            🔍
          </Link>
        </div>
      </div>

      {/* Row 2: category rail.
          - Expanded mode: black bar full-width, rail + "home" pill.
          - Compact mode: cream bar with mini logo at the left and a
            search icon at the right, category rail inline between them.
          Border-top only shows in expanded mode — in compact the row 1
          collapses to 0 height and the leftover border hairline makes
          the pills look "cut" by a stray horizontal line. */}
      <nav
        className={`transition-colors ${
          compact ? "bg-[#fff8ea]" : "border-t-2 border-black bg-black"
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

          <ul className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {!compact && (
              <li className="shrink-0">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 rounded-full border-2 border-white bg-[#ffd60a] px-3 py-1 text-xs font-black uppercase tracking-wide text-black shadow-[3px_3px_0_0_#ff2d87]"
                >
                  <span>🏠</span> หน้าแรก
                </Link>
              </li>
            )}
            {NAV_CATEGORIES.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link
                  href={`/category/${c.slug}`}
                  className={`inline-flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-black uppercase tracking-wide transition-colors ${
                    c.color
                  } ${c.text} ${
                    compact
                      ? "border-black"
                      : "border-white shadow-[3px_3px_0_0_#ffffff33]"
                  }`}
                >
                  <span>{c.emoji}</span> {c.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search icon — only visible in compact mode */}
          <Link
            href="/search"
            aria-label="Search"
            className={`grid h-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-black bg-white text-base shadow-[3px_3px_0_0_#121212] transition-[width,opacity] duration-200 ${
              compact ? "w-9 opacity-100" : "w-0 border-0 opacity-0"
            }`}
          >
            🔍
          </Link>
        </div>
      </nav>
    </header>
  );
}
