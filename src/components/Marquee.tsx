// A purely-CSS marquee — duplicates the children track so that a
// continuous scroll is visually seamless. Pauses on hover.

import { ReactNode } from "react";

export function Marquee({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`marquee-wrap overflow-hidden ${className}`}>
      <div className="marquee-track">
        <div className="flex shrink-0 items-center gap-10 pr-10">
          {children}
        </div>
        <div
          className="flex shrink-0 items-center gap-10 pr-10"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
