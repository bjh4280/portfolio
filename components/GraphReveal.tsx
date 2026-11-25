"use client";

import { useEffect, useRef, type ReactNode } from "react";

// 로드맵 그래프가 화면에 들어올 때, 로그가 출력되듯 한 줄씩 차례로 나타나게 합니다.
// - 움직임 줄이기 설정이거나 IntersectionObserver가 없으면 아무 효과 없이 완성된 모양을 보여 줍니다.
// - 자바스크립트가 실행되기 전(서버가 그린 첫 화면)에는 모든 줄이 보이는 상태입니다.
// - 한 번에 여러 줄이 들어오면 위에서부터 90ms 간격으로 이어서 나타납니다.
export default function GraphReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const rows: HTMLElement[] = Array.from(
      list.querySelectorAll<HTMLElement>(".g-row"),
    );
    list.classList.add("g-anim");

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              rows.indexOf(a.target as HTMLElement) -
              rows.indexOf(b.target as HTMLElement),
          )
          .forEach((entry, order) => {
            const row = entry.target as HTMLElement;
            row.style.setProperty("--d", `${order * 90}ms`);
            row.classList.add("is-in");
            observer.unobserve(row);
          });
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    rows.forEach((row) => observer.observe(row));

    return () => {
      observer.disconnect();
      list.classList.remove("g-anim");
      rows.forEach((row) => {
        row.classList.remove("is-in");
        row.style.removeProperty("--d");
      });
    };
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
