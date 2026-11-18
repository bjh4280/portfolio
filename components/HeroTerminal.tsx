"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

// 실행할 수 있는 명령어는 이 목록에 있는 것뿐입니다.
// 입력한 글자는 목록과 비교만 하고, 실행하거나 HTML로 넣지 않습니다.
const COMMANDS = ["help", "projects", "contact", "clear"] as const;
type Command = (typeof COMMANDS)[number];

function isCommand(value: string): value is Command {
  return (COMMANDS as readonly string[]).includes(value);
}

type Entry = { id: number; command: string; output: ReactNode };

export default function HeroTerminal({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 명령어를 실행해 내용이 늘어나면 맨 아래(입력 줄)가 보이도록 스크롤합니다.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [entries]);

  function outputFor(command: Exclude<Command, "clear">): ReactNode {
    if (command === "help") {
      return (
        <ul className="t-list">
          <li><span className="t-key">help</span> 명령어 목록</li>
          <li><span className="t-key">projects</span> 프로젝트 보기</li>
          <li><span className="t-key">contact</span> 연락처 보기</li>
          <li><span className="t-key">clear</span> 화면 지우기</li>
        </ul>
      );
    }
    if (command === "projects") {
      return (
        <ul className="t-list">
          <li>01 개인 포트폴리오</li>
          <li>02 수업 실습 프로젝트</li>
          <li>
            <Link href="/projects" className="t-link">→ 프로젝트 페이지로 이동</Link>
          </li>
        </ul>
      );
    }
    return (
      <ul className="t-list">
        <li>
          <a href={`mailto:${email}`} className="t-link">{email}</a>
        </li>
        <li>
          <a href="#contact" className="t-link">→ 연락 폼으로 이동</a>
        </li>
      </ul>
    );
  }

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;
    const command = text.toLowerCase();

    if (command === "clear") {
      setEntries([]);
      return;
    }

    const output = isCommand(command) ? (
      outputFor(command as Exclude<Command, "clear">)
    ) : (
      <span className="t-err">
        command not found: {text} (help를 입력해 보세요)
      </span>
    );

    idRef.current += 1;
    const id = idRef.current;
    setEntries((prev) => [...prev.slice(-9), { id, command: text, output }]);

  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(value);
    setValue("");
  }

  const line = (i: number): CSSProperties => ({ "--i": i }) as CSSProperties;

  return (
    <div className="terminal" role="group" aria-label="소개 터미널">
      <div className="window-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <code>~/portfolio — zsh</code>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        <p className="t-line" style={line(0)}>
          <span className="t-prompt">$</span> whoami
        </p>
        <p className="t-line t-out" style={line(1)}>{name}</p>
        <p className="t-line" style={line(2)}>
          <span className="t-prompt">$</span> cat role.txt
        </p>
        <p className="t-line t-out" style={line(3)}>
          정보보호학과 2학년 · 웹 개발 · 보안
        </p>
        <p className="t-line" style={line(4)}>
          <span className="t-prompt">$</span> ls stack/
        </p>
        <p className="t-line t-out" style={line(5)}>
          Next.js  MongoDB  Auth.js
        </p>
        <p className="t-line" style={line(6)}>
          <span className="t-prompt">$</span> ./status
        </p>
        <p className="t-line t-out" style={line(7)}>
          <span className="t-ok">[OK]</span> 웹 서버보안프로그래밍 수강 중
        </p>

        {entries.map((entry) => (
          <div className="t-entry" key={entry.id}>
            <p className="t-cmd">
              <span className="t-prompt">$</span> {entry.command}
            </p>
            <div className="t-out">{entry.output}</div>
          </div>
        ))}

        <form className="t-line t-form" style={line(8)} onSubmit={onSubmit}>
          <label htmlFor="terminal-input" className="sr-only">
            터미널 명령어 입력
          </label>
          <span className="t-prompt" aria-hidden="true">$</span>
          <input
            id="terminal-input"
            className="t-input"
            name="command"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            maxLength={30}
            placeholder="help"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </form>
      </div>

      <div className="t-actions">
        <span className="t-hint">help를 입력하거나 눌러 보세요</span>
        {(["help", "projects", "contact"] as const).map((command) => (
          <button
            key={command}
            type="button"
            className="t-btn"
            onClick={() => run(command)}
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
