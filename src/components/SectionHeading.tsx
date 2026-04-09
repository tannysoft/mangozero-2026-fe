import Link from "next/link";
import { ReactNode } from "react";

export function SectionHeading({
  emoji,
  label,
  title,
  color = "bg-[#ffd60a]",
  href,
  children,
}: {
  emoji?: string;
  label?: string;
  title: string;
  color?: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {label && (
          <div
            className={`inline-flex items-center gap-1 rounded-full border-2 border-black ${color} px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-[3px_3px_0_0_#121212]`}
          >
            {emoji && <span>{emoji}</span>}
            {label}
          </div>
        )}
        <h2 className="mt-2 font-[var(--font-display)] text-3xl font-black leading-[1.25] sm:text-4xl sm:leading-[1.2]">
          {title}
        </h2>
        {children && (
          <p className="mt-1 text-sm text-black/60">{children}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="btn-chunk text-xs uppercase"
        >
          ดูทั้งหมด →
        </Link>
      )}
    </div>
  );
}
