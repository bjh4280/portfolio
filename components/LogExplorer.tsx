"use client";

import { useEffect, useState } from "react";
import CodeSnippet from "@/components/CodeSnippet";
import SecurityReport, { THREATS } from "@/components/SecurityReport";

export type Project = "portfolio" | "class" | "report";

export type LogEntry = {
  project: Project;
  no: string;
  status: string;
  tag: string;
  title: string;
  learned: string;
  file: string;
  code: string;
  check?: string;
  before?: string;
  vuln?: boolean;
};

function LogItem({ log, index }: { log: LogEntry; index: number }) {
  const [showBefore, setShowBefore] = useState(false);
  const hasBefore = Boolean(log.before);
  const vulnerable = hasBefore && showBefore;

  return (
    <li className="log-item" style={{ ["--n" as string]: index }}>
      <div className="log-text">
        <p className="log-head">
          <span className="log-no">#{log.no}</span>
          <span className="log-tag">[{log.tag}]</span>
        </p>
        <h2 className="log-title">{log.title}</h2>
        <p className="log-learned">{log.learned}</p>
        {log.check && (
          <p className="log-check">
            <span>확인 방법</span>
            {log.check}
          </p>
        )}
        {hasBefore && (
          <button
            type="button"
            className="log-toggle"
            aria-pressed={showBefore}
            onClick={() => setShowBefore((v) => !v)}
          >
            {showBefore ? "$ 수정한 코드 보기" : "$ 취약했던 코드 보기"}
          </button>
        )}
      </div>
      <CodeSnippet
        file={log.file}
        code={vulnerable && log.before ? log.before : log.code}
        label={hasBefore ? (vulnerable ? "VULN" : "FIXED") : undefined}
        tone={vulnerable ? "vuln" : "fixed"}
      />
    </li>
  );
}

const PROJECTS: { id: Project; label: string; dir: string }[] = [
  { id: "portfolio", label: "개인 포트폴리오", dir: "~/projects/portfolio" },
  { id: "class", label: "수업 프로젝트", dir: "~/projects/class-practice" },
  { id: "report", label: "보안 점검 리포트", dir: "~/projects/portfolio" },
];

export default function LogExplorer({ logs }: { logs: LogEntry[] }) {
  const [project, setProject] = useState<Project>("portfolio");

  // 홈에서 /log#report 로 들어오면 리포트 탭을 바로 보여줍니다.
  useEffect(() => {
    if (window.location.hash === "#report") setProject("report");
  }, []);

  function pick(id: Project) {
    setProject(id);
    try {
      window.history.replaceState(null, "", id === "report" ? "#report" : "#");
    } catch {
      // 주소 갱신에 실패해도 탭 전환은 그대로 동작합니다.
    }
  }

  const visible = logs
    .filter((l) => l.project === project)
    .sort((a, b) => a.no.localeCompare(b.no));
  const current = PROJECTS.find((p) => p.id === project) ?? PROJECTS[0];

  const topics = new Set(visible.map((l) => l.tag)).size;
  const defended = visible.filter((l) => l.vuln).length;

  const stats = [
    { num: visible.length, label: "기록" },
    { num: topics, label: "다룬 보안 주제" },
    ...(defended > 0 ? [{ num: defended, label: "직접 방어한 취약점" }] : []),
  ];

  return (
    <div>
      <div className="log-tabs" role="tablist" aria-label="보기 선택">
        {PROJECTS.map((p) => (
          <button
            type="button"
            role="tab"
            key={p.id}
            className="log-tab"
            aria-selected={project === p.id}
            onClick={() => pick(p.id)}
          >
            {p.label}
            <span className="log-chip-n">
              {p.id === "report"
                ? THREATS.length
                : logs.filter((l) => l.project === p.id).length}
            </span>
          </button>
        ))}
      </div>

      {project === "report" ? (
        <SecurityReport />
      ) : (
        <>
          <dl className="log-stats">
            {stats.map((st) => (
              <div className="log-stat" key={st.label}>
                <dd className="log-stat-num">{st.num}</dd>
                <dt className="log-stat-label">{st.label}</dt>
              </div>
            ))}
          </dl>

          <p className="log-cmd" aria-live="polite">
            <span aria-hidden="true">$ </span>
            cd {current.dir} &amp;&amp; git log
            <span className="log-cmd-n"> — {visible.length}개</span>
          </p>
          <ol className="log-list" key={project}>
            {visible.map((log, i) => (
              <LogItem log={log} index={i} key={`${log.project}-${log.no}`} />
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
