"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 메뉴 항목은 여기서 수정하세요. 페이지를 추가하면 한 줄씩 늘리면 됩니다.
const links = [
  { href: "/", label: "홈" },
  { href: "/projects", label: "프로젝트" },
  { href: "/plans", label: "앞으로의 계획" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="주 메뉴">
      <div className="wrap site-nav-inner">
        <Link href="/" className="site-nav-brand">
          배종현
        </Link>
        <ul className="site-nav-links">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="site-nav-link"
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
