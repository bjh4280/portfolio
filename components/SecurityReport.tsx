"use client";

import { useState } from "react";

// 이 사이트(개인 포트폴리오)의 위협과 방어, 그리고 남은 한계를 정리한 목록입니다.
// state: "ok"는 방어가 적용되어 큰 한계가 없는 항목, "partial"은 보완이 더 필요한 항목입니다.
// 방어를 보완하면 state를 "ok"로 바꾸세요.

type Threat = {
  state: "ok" | "partial";
  tag: string;
  short: string;
  title: string;
  threat: string;
  defense: string;
  limit: string;
};

export const THREATS: Threat[] = [
  {
    state: "partial",
    tag: "spam",
    short: "스팸·폭주",
    title: "문의 폼 스팸과 폭주",
    threat:
      "자동화된 도구가 문의를 계속 보내 DB와 메일함을 채울 수 있습니다.",
    defense:
      "숨김 입력칸(honeypot)으로 봇을 걸러내고, 같은 IP는 10분에 5번까지만 받습니다.",
    limit:
      "횟수 카운터가 서버 메모리에 있어서 서버가 재시작되거나 여러 대로 늘어나면 초기화·분리됩니다. Redis 같은 공유 저장소가 필요합니다.",
  },
  {
    state: "ok",
    tag: "csrf",
    short: "몰래 요청",
    title: "다른 사이트에서 몰래 보내는 요청",
    threat:
      "다른 사이트의 폼이나 스크립트가 방문자의 브라우저로 문의 API를 호출할 수 있습니다.",
    defense: "Origin 헤더가 우리 주소와 같은 요청만 받고, 다르면 403으로 거절합니다.",
    limit:
      "Origin은 curl처럼 브라우저 밖에서 보내는 요청에서는 위조할 수 있어서, 횟수 제한과 입력 검증이 함께 필요합니다.",
  },
  {
    state: "ok",
    tag: "input",
    short: "비정상 입력",
    title: "비정상 입력",
    threat:
      "너무 길거나 형식이 틀린 값, 아주 큰 요청 본문, 메일 제목에 섞어 넣은 줄바꿈이 올 수 있습니다.",
    defense:
      "서버에서 이름·이메일·메시지의 길이와 형식을 검증하고, 본문은 헤더 값이 아니라 실제로 읽은 크기가 10KB를 넘으면 거절하며, 메일 제목의 줄바꿈은 지웁니다. DB에는 문자열 값만 저장합니다.",
    limit:
      "이메일은 단순한 형식 검사만 해서 실제로 존재하는 주소인지는 확인하지 않습니다.",
  },
  {
    state: "partial",
    tag: "secrets",
    short: "비밀값",
    title: "비밀값 유출",
    threat: "DB 접속 주소와 메일 API 키가 코드나 저장소로 새어 나갈 수 있습니다.",
    defense:
      "환경변수로 분리하고 .env 파일은 .gitignore로 제외했으며, 배포 서비스에도 따로 설정합니다.",
    limit:
      "키 교체가 수동이라 주기적으로 직접 바꿔야 하고, 한 번 노출된 키는 반드시 새로 발급받아야 합니다.",
  },
  {
    state: "partial",
    tag: "headers",
    short: "클릭재킹",
    title: "클릭재킹과 파일 형식 추측",
    threat:
      "다른 사이트가 이 페이지를 iframe에 넣어 클릭을 가로채거나, 브라우저가 파일 형식을 제멋대로 해석할 수 있습니다.",
    defense:
      "X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy 헤더를 모든 응답에 붙였습니다.",
    limit:
      "CSP는 적용하지 않았습니다. 다크 모드를 위한 인라인 스크립트 때문에 nonce 설정이 추가로 필요합니다.",
  },
  {
    state: "ok",
    tag: "transport",
    short: "통신 도청",
    title: "통신 내용 엿보기",
    threat: "공용 네트워크에서 방문자와 서버 사이의 내용을 엿볼 수 있습니다.",
    defense: "Vercel 배포로 HTTPS 연결을 사용합니다.",
    limit:
      "HSTS 헤더는 직접 설정하지 않았습니다. 배포 환경의 기본 동작을 확인해야 합니다.",
  },
  {
    state: "partial",
    tag: "database",
    short: "DB 접근",
    title: "DB에 대한 직접 접근",
    threat: "브라우저나 외부에서 DB에 직접 접속하려는 시도가 있을 수 있습니다.",
    defense:
      "DB 접근은 서버 코드에서만 하고, 브라우저에는 API 응답만 전달합니다.",
    limit:
      "DB 계정 권한과 Atlas에서 허용한 접속 IP 범위를 최소로 줄였는지 별도로 점검해야 합니다.",
  },
];

const NEXT_STEPS = [
  "CSP 적용 (인라인 테마 스크립트에 nonce 사용)",
  "공유 저장소(Redis 등) 기반 요청 횟수 제한",
  "비밀값을 정해진 주기로 교체",
  "npm audit 같은 의존성 점검을 정기적으로 실행",
];

// 수업에서 다룬 주제가 이 사이트와 수업 프로젝트에 어떻게 적용됐는지 한눈에 보는 표입니다.
// 번호는 학습 로그(/log)의 항목 번호입니다. 적용하지 않은 곳은 이유를 적습니다.
const COVERAGE: { topic: string; site: string; course: string }[] = [
  {
    topic: "입력 검증",
    site: "이름·이메일·메시지 길이와 형식 검증, 본문 10KB 제한 (#02, #09)",
    course: "쿠키 값도 서버에서 다시 검증 (#05)",
  },
  {
    topic: "XSS",
    site: "방문자 입력을 HTML로 넣지 않습니다. dangerouslySetInnerHTML은 고정된 테마·입장 스크립트 두 곳뿐입니다.",
    course: "dangerouslySetInnerHTML을 지우고 자동 이스케이프 사용 (#09)",
  },
  {
    topic: "NoSQL 인젝션",
    site: "문의 값이 문자열인지 확인한 뒤에만 저장하고, 방문자 입력으로 DB를 조회하지 않습니다.",
    course: "입력의 타입 확인과 이스케이프 (#11)",
  },
  {
    topic: "인증·인가·IDOR",
    site: "해당 없음 (로그인 기능이 없습니다)",
    course: "비밀번호 해시, 세션, role·소유권 검사, 404 처리 (#01~#07, #12)",
  },
  {
    topic: "시크릿 관리",
    site: ".env로 분리하고 .gitignore로 제외 (#03, #04)",
    course: "시크릿이 없으면 바로 실패시키기 (#10)",
  },
  {
    topic: "Rate Limiting",
    site: "문의 폼: 같은 IP는 10분에 5번 (#05)",
    course: "로그인 시도 횟수 제한 (#13)",
  },
  {
    topic: "보안 헤더",
    site: "4개 적용, CSP는 아직 없음 (#07)",
    course: "보안 헤더 추가 (#14)",
  },
  {
    topic: "CSRF",
    site: "Origin이 같은 사이트일 때만 요청 허용 (#06)",
    course: "—",
  },
];

export default function SecurityReport() {
  const [open, setOpen] = useState<string[]>([]);
  const partial = THREATS.filter((t) => t.state === "partial").length;

  function toggle(tag: string) {
    setOpen((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function jump(tag: string) {
    setOpen((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    // 카드가 펼쳐진 뒤 그 위치로 이동합니다.
    window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById(`rep-${tag}`)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }, 30);
  }

  const allOpen = open.length === THREATS.length;

  return (
    <div>
      <dl className="log-stats">
        <div className="log-stat">
          <dd className="log-stat-num">{THREATS.length}</dd>
          <dt className="log-stat-label">점검한 위협</dt>
        </div>
        <div className="log-stat rep-stat-ok">
          <dd className="log-stat-num">{THREATS.length - partial}</dd>
          <dt className="log-stat-label">방어 적용 완료</dt>
        </div>
        <div className="log-stat rep-stat-warn">
          <dd className="log-stat-num">{partial}</dd>
          <dt className="log-stat-label">보완 필요</dt>
        </div>
      </dl>

      <p className="log-intro">
        이 사이트를 만든 뒤, 무엇을 지키려 했고 무엇이 아직 부족한지 정리했습니다.
        방어한 것만큼 남은 한계를 적는 것도 보안의 일부라고 생각합니다.
      </p>

      <p className="log-cmd">
        <span aria-hidden="true">$ </span>security --status
        <span className="log-cmd-n"> — 타일을 누르면 자세히 볼 수 있습니다</span>
      </p>

      <div className="rep-legend" aria-hidden="true">
        <span className="rep-dot rep-dot-ok" /> 방어 적용 완료
        <span className="rep-dot rep-dot-partial" /> 보완 필요
      </div>

      <div className="rep-tiles">
        {THREATS.map((t) => (
          <button
            type="button"
            key={t.tag}
            className={`rep-tile rep-tile-${t.state}`}
            onClick={() => jump(t.tag)}
          >
            <span className="rep-tile-tag">
              {t.state === "ok" ? "[OK]" : "[LIMIT]"} {t.tag}
            </span>
            <span className="rep-tile-name">{t.short}</span>
          </button>
        ))}
      </div>

      <div className="rep-toolbar">
        <button
          type="button"
          className="log-toggle"
          onClick={() =>
            setOpen(allOpen ? [] : THREATS.map((t) => t.tag))
          }
        >
          {allOpen ? "$ 모두 접기" : "$ 모두 펼치기"}
        </button>
      </div>

      <ol className="rep-list">
        {THREATS.map((t, i) => {
          const isOpen = open.includes(t.tag);
          return (
            <li
              className={`rep-card rep-card-${t.state}`}
              id={`rep-${t.tag}`}
              key={t.tag}
            >
              <button
                type="button"
                className="rep-card-head"
                aria-expanded={isOpen}
                aria-controls={`rep-panel-${t.tag}`}
                onClick={() => toggle(t.tag)}
              >
                <span className="rep-card-no">
                  #{String(i + 1).padStart(2, "0")}
                </span>
                <span className="rep-card-title">{t.title}</span>
                <span className={`rep-badge rep-badge-${t.state}`}>
                  {t.state === "ok" ? "방어 적용" : "보완 필요"}
                </span>
                <span className="rep-chevron" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <dl className="rep-rows" id={`rep-panel-${t.tag}`}>
                  <div>
                    <dt>위협</dt>
                    <dd>{t.threat}</dd>
                  </div>
                  <div>
                    <dt className="rep-ok">[OK] 방어</dt>
                    <dd>{t.defense}</dd>
                  </div>
                  <div>
                    <dt className="rep-limit">[LIMIT] 한계</dt>
                    <dd>{t.limit}</dd>
                  </div>
                </dl>
              )}
            </li>
          );
        })}
      </ol>

      <p className="log-cmd">
        <span aria-hidden="true">$ </span>cat coverage.md
        <span className="log-cmd-n"> — 수업 주제별 적용 위치</span>
      </p>
      <div className="rep-map-wrap">
        <table className="rep-map">
          <thead>
            <tr>
              <th scope="col">수업 주제</th>
              <th scope="col">이 포트폴리오</th>
              <th scope="col">수업 프로젝트</th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE.map((row) => (
              <tr key={row.topic}>
                <th scope="row">{row.topic}</th>
                <td data-label="이 포트폴리오">{row.site}</td>
                <td data-label="수업 프로젝트">{row.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="log-cmd">
        <span aria-hidden="true">$ </span>cat TODO.md
      </p>
      <ul className="rep-next">
        {NEXT_STEPS.map((step) => (
          <li key={step}>
            <span aria-hidden="true">[ ] </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
