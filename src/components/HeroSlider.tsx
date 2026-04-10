"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type SlideData = {
  id: number;
  href: string;
  title: string;
  excerpt: string;
  category?: string;
  img?: {
    src: string;
    srcSet?: string;
  };
};

export function HeroSlider({ slides }: { slides: SlideData[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const len = slides.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % len);
    }, 5000);
  }, [len]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = (i: number) => {
    setCurrent(i);
    resetTimer();
  };

  const prev = () => goTo((current - 1 + len) % len);
  const next = () => goTo((current + 1) % len);

  const slide = slides[current];
  if (!slide) return null;

  return (
    <div className="card-chunk group relative h-full min-h-[420px] overflow-hidden sm:min-h-[520px]">
      {/* Images — all rendered, only active one visible */}
      {slides.map((s, i) => (
        <Link key={s.id} href={s.href} className="absolute inset-0">
          {s.img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.img.src}
              srcSet={s.img.srcSet}
              sizes="(min-width: 1024px) 900px, 100vw"
              alt={s.title}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </Link>
      ))}

      {/* Gradient + text overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-black/0 p-5 sm:p-7">
        {slide.category && (
          <span className="inline-flex w-fit items-center rounded-md bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase text-white backdrop-blur-sm">
            {slide.category}
          </span>
        )}
        <h2 className="mt-3 line-clamp-2 text-2xl font-extrabold leading-[1.3] text-white sm:text-3xl sm:leading-[1.25] md:text-4xl">
          {slide.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-white/70">
          {slide.excerpt}
        </p>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="pointer-events-auto absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="pointer-events-auto absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === current
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
