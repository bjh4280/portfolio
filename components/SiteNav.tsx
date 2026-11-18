"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// 메뉴 항목은 여기서 수정하세요. 페이지를 추가하면 한 줄씩 늘리면 됩니다.
const links = [
  { href: "/", label: "홈" },
  { href: "/projects", label: "프로젝트" },
  { href: "/plans", label: "앞으로의 계획" },
  { href: "/log", label: "학습 로그" },
  { href: "/#contact", label: "연락하기" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="주 메뉴">
      <div className="wrap site-nav-inner">
        <Link href="/" className="site-nav-brand">
          배종현
        </Link>
        <div className="site-nav-right">
          <ul className="site-nav-links">
            {links.map(({ href, label }) => {
              const active = href.includes("#")
                ? false
                : href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
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
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
