"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Menüpunkt, der hervorgehoben ist, wenn man gerade auf dieser Seite ist
export function NavLink({
  href,
  genau = false,
  children,
}: {
  href: string;
  genau?: boolean;
  children: ReactNode;
}) {
  const pfad = usePathname();
  const aktiv = genau ? pfad === href : pfad.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={aktiv ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-subtil px-3 transition-colors ${
        aktiv ? "text-text" : "text-text-zwei hover:bg-flaeche hover:text-text"
      }`}
    >
      {children}
    </Link>
  );
}
