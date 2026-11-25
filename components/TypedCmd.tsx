"use client";

import { useEffect, useRef, useState } from "react";

// 화면에 나타날 때 명령어가 한 글자씩 입력되는 효과입니다.
// - 움직임 줄이기 설정이거나 IntersectionObserver가 없으면 처음부터 전체를 보여 줍니다.
// - 서버가 그려 주는 첫 화면에는 전체 문장이 들어 있어서, 자바스크립트가 없어도 읽을 수 있습니다.
// - 아직 입력되지 않은 글자는 보이지 않게 자리만 차지해서 줄이 흔들리지 않습니다.
export default function TypedCmd({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(text.length);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;
    setCount(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setTyping(true);
        let i = 0;
        const tick = () => {
          if (cancelled) return;
          i += 1;
          setCount(i);
          if (i < text.length) {
            timer = window.setTimeout(tick, 45);
          } else {
            // 다 입력한 뒤 잠깐 커서를 보여 주고 지웁니다.
            timer = window.setTimeout(() => setTyping(false), 700);
          }
        };
        timer = window.setTimeout(tick, 250);
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      <span>{text.slice(0, count)}</span>
      {typing && <span className="typed-caret" />}
      <span className="typed-rest">{text.slice(count)}</span>
    </span>
  );
}
