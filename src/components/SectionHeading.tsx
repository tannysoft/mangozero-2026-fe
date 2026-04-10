import Link from "next/link";
import { ReactNode } from "react";

export function SectionHeading({
  label,
  title,
  color = "bg-[#121212]",
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
            className={`inline-flex items-center rounded-md ${color} px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white`}
          >
            {label}
          </div>
        )}
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-extrabold leading-[1.25] sm:text-3xl sm:leading-[1.2]">
          {title}
        </h2>
        {children && (
          <p className="mt-1 text-sm text-black/50">{children}</p>
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
