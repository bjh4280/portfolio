import type { ReactNode } from "react";

// 아주 간단한 색칠기: 주석 / 문자열 / 키워드 / 함수 이름 / 숫자만 구분합니다.
const TOKEN =
  /(\/\/.*$|^\s*#.*$)|("[^"]*"|'[^']*')|\b(const|let|if|return|await|async|export|function|import|from|new)\b|\b([A-Za-z_]\w*)(?=\()|\b(\d+)\b/g;
const CLASSES = ["", "c-com", "c-str", "c-key", "c-fn", "c-str"];

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));
    const group = m.findIndex((v, i) => i > 0 && v !== undefined);
    out.push(
      <span className={CLASSES[group]} key={at}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export default function CodeSnippet({
  file,
  code,
  label,
  tone,
}: {
  file: string;
  code: string;
  label?: string;
  tone?: "vuln" | "fixed";
}) {
  const lines = code.split("\n");
  return (
    <figure className="snippet">
      <div className="snippet-bar">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <code>{file}</code>
        {label && (
          <em className={`snippet-label snippet-${tone ?? "fixed"}`}>[{label}]</em>
        )}
      </div>
      <pre className="snippet-code" tabIndex={0}>
        <code>
          {lines.map((line, i) => (
            <span key={i}>
              {highlight(line)}
              {i < lines.length - 1 ? "\n" : ""}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
