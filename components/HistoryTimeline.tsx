"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Item = {
  version: string;
  image: string;
  title: string;
  text: string;
  narrow?: boolean;
};

// 변천사: 위의 점을 누르면 그 단계만 아래에 크게 보여 줍니다.
export default function HistoryTimeline({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(items.length - 1);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const item = items[index];

  function go(next: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    setIndex(clamped);
    buttons.current[clamped]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      go(0);
    } else if (event.key === "End") {
      event.preventDefault();
      go(items.length - 1);
    }
  }

  return (
    <div className="hist">
      <ol className="hist-nodes" role="tablist" aria-label="포트폴리오 변천사">
        {items.map((it, i) => (
          <li key={it.version}>
            <button
              type="button"
              role="tab"
              id={`hist-tab-${it.version}`}
              aria-selected={i === index}
              aria-controls="hist-panel"
              tabIndex={i === index ? 0 : -1}
              className="hist-node"
              ref={(el) => {
                buttons.current[i] = el;
              }}
              onClick={() => setIndex(i)}
              onKeyDown={onKeyDown}
            >
              {it.version}
            </button>
          </li>
        ))}
      </ol>

      <article
        className="project hist-panel"
        id="hist-panel"
        role="tabpanel"
        aria-labelledby={`hist-tab-${item.version}`}
        key={item.version}
      >
        <p className="hist-cmd">
          <span aria-hidden="true">$ </span>git show {item.version}
        </p>
        <h3 className="project-title">{item.title}</h3>
        <p className="project-summary history-text">{item.text}</p>
        {item.image && (
          <img
            className={`project-shot history-shot${item.narrow ? " history-shot-narrow" : ""}`}
            src={item.image}
            alt={`${item.version} 화면`}
          />
        )}
        <div className="hist-nav">
          <button
            type="button"
            className="hist-step"
            onClick={() => go(index - 1)}
            disabled={index === 0}
          >
            ← 이전
          </button>
          <span className="hist-count" aria-live="polite">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            className="hist-step"
            onClick={() => go(index + 1)}
            disabled={index === items.length - 1}
          >
            다음 →
          </button>
        </div>
      </article>
    </div>
  );
}
