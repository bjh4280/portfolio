"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 처음 들어온 방문자에게 한 번만 보여 주는 접속 화면입니다. (홈에서만, 같은 탭에서는 1번)
const KEY = "gate-seen";

// 홈의 터미널과 같은 명령으로 시작해서, 본인 소개가 그대로 이어지게 합니다.
const LINES = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "배종현" },
  { kind: "cmd", text: "cat role.txt" },
  { kind: "out", text: "정보보호학과 2학년 · 웹 개발 · 보안" },
  { kind: "cmd", text: "cat motto.txt" },
  { kind: "out", text: "막히면 원인을 끝까지 찾습니다." },
] as const;

const STEP_MS = 320;

export default function EntryGate() {
  const [phase, setPhase] = useState<"off" | "open" | "closing">("off");
  const [shown, setShown] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const ready = shown >= LINES.length;

  const enter = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* 저장이 막혀 있어도 입장은 됩니다 */
    }
    delete document.documentElement.dataset.gate;
    setPhase("closing");
    window.setTimeout(() => setPhase("off"), 300);
  }, []);

  // 처음 한 번: 이미 봤거나, 움직임 줄이기 설정이면 건너뜁니다.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      delete document.documentElement.dataset.gate;
      return;
    }
    document.documentElement.dataset.gate = "open";
    setPhase("open");
  }, []);

  // 줄이 하나씩 나옵니다.
  useEffect(() => {
    if (phase !== "open" || ready) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), STEP_MS);
    return () => window.clearTimeout(id);
  }, [phase, shown, ready]);

  // 열려 있는 동안: 스크롤 잠금, 포커스, 아무 키나 누르면 입장
  useEffect(() => {
    if (phase !== "open") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key)) return;
      event.preventDefault();
      enter();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, enter]);

  if (phase === "off") return null;

  return (
    <div
      className={`gate${phase === "closing" ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="포트폴리오 시작 화면"
      tabIndex={-1}
      ref={rootRef}
      onClick={enter}
    >
      <button
        type="button"
        className="gate-skip"
        onClick={(event) => {
          event.stopPropagation();
          enter();
        }}
      >
        건너뛰기
      </button>
      <div className="gate-window">
        <div className="gate-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <code>~/portfolio — zsh</code>
        </div>
        <ul className="gate-lines" aria-live="polite">
          {LINES.slice(0, shown).map((line) => (
            <li key={line.text} className={`gate-line gate-${line.kind}`}>
              {line.kind === "cmd" && (
                <span className="gate-prompt" aria-hidden="true">
                  ${" "}
                </span>
              )}
              {line.text}
            </li>
          ))}
          {!ready && (
            <li className="gate-cursor" aria-hidden="true">
              ▋
            </li>
          )}
        </ul>
        {ready && (
          <p className="gate-hint">
            <button
              type="button"
              className="gate-enter"
              onClick={(event) => {
                event.stopPropagation();
                enter();
              }}
              autoFocus
            >
              [ 포트폴리오 열기 ]
            </button>
            <span>Enter 또는 아무 키</span>
          </p>
        )}
      </div>
    </div>
  );
}
