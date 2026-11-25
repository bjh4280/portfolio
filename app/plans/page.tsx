import type { CSSProperties } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import GraphReveal from "@/components/GraphReveal";
import { pageMeta } from "@/lib/siteMeta";

// 내용은 초안입니다. 본인의 실제 계획에 맞게 문장을 고쳐 쓰세요.
// state: "done"(끝낸 일 ●) · "now"(지금 하는 일 ◉) · "todo"(예정 ○)
// lane : "main"(본 줄기) · "branch"(옆으로 갈라진 작업 묶음)
// group: branch 항목이 같은 group이면 한 갈래로 묶여서, 갈라졌다가 다시 합쳐지는 선으로 그려집니다.
//        갈래의 첫 항목에는 branchName(갈래 이름표)을 적으세요.
// why / check : 항목을 눌렀을 때 펼쳐지는 "왜 하는지", "끝났는지 어떻게 확인하는지"
// 끝낸 일은 state를 "done"으로 바꾸세요. (아직 안 한 일을 done으로 두지 않기)
type Step = {
  lane: "main" | "branch";
  state: "done" | "now" | "todo";
  when: string;
  title: string;
  why?: string;
  check?: string;
  group?: string;
  branchName?: string;
  tone?: "army"; // 군 복무처럼 색을 달리 보이고 싶은 갈래
};

const steps: Step[] = [
  {
    lane: "main",
    state: "done",
    when: "완료",
    title: "1학년 마무리",
  },
  {
    lane: "branch",
    state: "done",
    when: "완료",
    group: "mil",
    branchName: "병역",
    tone: "army",
    title: "만기 전역",
  },
  {
    lane: "main",
    state: "done",
    when: "2학년",
    title: "복학",
  },
  {
    lane: "branch",
    state: "now",
    when: "지금",
    group: "y2",
    branchName: "year-2",
    title: "배포 주소에서 최종 점검하고 비밀값 교체",
    why: "대화나 화면에 드러났을 수 있는 DB 비밀번호와 메일 API 키는 새로 발급해야 합니다. 배포 환경변수도 같이 바꿉니다.",
    check: "배포 주소에서 문의를 보내 메일이 오는지, 휴대폰 화면이 깨지지 않는지 확인",
  },
  {
    lane: "branch",
    state: "todo",
    when: "2학년",
    group: "y2",
    title: "이 사이트의 남은 한계 보완 (CSP, 공유 저장소 기반 횟수 제한)",
    why: "CSP는 인라인 스크립트 때문에, 횟수 제한은 서버 메모리 방식이라 아직 한계가 남아 있습니다.",
    check: "curl -I 로 CSP 헤더가 보이는지, 서버를 재시작해도 횟수가 유지되는지 확인",
  },
  {
    lane: "branch",
    state: "todo",
    when: "2학년",
    group: "y2",
    title: "OWASP Top 10 정리와 의존성 점검(npm audit)",
    why: "수업에서 다룬 항목이 어디에 해당하는지 한 번에 보이게 정리하고, 쓰는 라이브러리의 알려진 취약점을 정기적으로 확인합니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "3학년",
    group: "y3",
    branchName: "year-3",
    title: "전공 기초 넓히기 (네트워크·시스템·암호)",
    why: "웹만 아는 것에서 벗어나 서버와 네트워크가 어떻게 동작하는지 이해해야 방어도 설계할 수 있습니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "3학년",
    group: "y3",
    title: "배포와 클라우드 보안",
    why: "서비스 배포와 권한 관리를 익히고, 점검 도구를 직접 써 봅니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "3학년",
    group: "y3",
    title: "팀 프로젝트·공모전·대회 도전, 자격증 준비",
    why: "혼자 만든 것을 다른 사람과 함께 만들고 평가받는 경험을 쌓습니다. 자격증은 진로에 맞춰 고를 예정입니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "4학년",
    group: "y4",
    branchName: "year-4",
    title: "졸업 작품: 보안을 설계한 프로젝트 완성",
    why: "기능을 만드는 데서 끝내지 않고, 방어까지 설계한 결과물을 남기는 것이 목표입니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "4학년",
    group: "y4",
    title: "현장 경험 (인턴·실습)",
    why: "수업과 실제 업무의 차이를 직접 겪어 보고, 어떤 일이 맞는지 확인합니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "4학년",
    group: "y4",
    title: "진로 결정과 취업 준비",
    why: "지금까지 만든 포트폴리오를 정리하고, 지원할 분야를 좁힙니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "졸업 후",
    group: "after",
    branchName: "after-graduation",
    title: "보안을 아는 개발자로 일 시작하기",
    why: "개발과 보안 중 어느 쪽에 더 무게를 둘지는 현장 경험을 해 본 뒤 정합니다.",
  },
  {
    lane: "branch",
    state: "todo",
    when: "졸업 후",
    group: "after",
    title: "계속 배우고 공유하기",
    why: "새 위협과 기술은 계속 바뀌므로, 배운 것을 글이나 코드로 남기며 따라갑니다. 진학도 선택지로 열어 둡니다.",
  },
  {
    lane: "main",
    state: "todo",
    when: "최종 목표",
    title: "잘 살아가기",
  },
];

const STATE_TEXT = { done: "완료", now: "진행 중", todo: "예정" } as const;
const STATE_MARK = { done: "[x]", now: "[~]", todo: "[ ]" } as const;

export const metadata = pageMeta(
  "앞으로의 계획",
  "지나온 일과 지금 하는 일, 2학년부터 졸업 후까지의 계획을 git 그래프처럼 이어서 정리했습니다.",
);

export default function PlansPage() {
  const nowIndex = steps.findIndex((s) => s.state === "now");
  // 지금 위치에서 멀수록 점과 선이 연해집니다. (마지막 목표는 항상 선명하게)
  const anchor =
    nowIndex >= 0 ? nowIndex : steps.map((s) => s.state).lastIndexOf("done");

  return (
    <main>
      <section className="section" aria-labelledby="plans-title">
        <Reveal className="wrap">
          <h1 className="section-title" id="plans-title">
            <span className="section-no" aria-hidden="true">
              $ cat
            </span>
            roadmap.md
          </h1>
          <p className="log-cmd">
            <span aria-hidden="true">$ </span>git log --graph --oneline
            <span className="log-cmd-n"> — 항목을 누르면 이유와 확인 방법이 열립니다</span>
          </p>
          <p className="g-legend" aria-hidden="true">
            <span className="g-key g-key-done" /> 끝낸 일
            <span className="g-key g-key-now" /> 지금
            <span className="g-key g-key-todo" /> 예정
          </p>

          <GraphReveal className="g-graph">
            {steps.map((step, i) => {
              const prev = steps[i - 1];
              const next = steps[i + 1];
              const isBranch = step.lane === "branch";
              const fork =
                isBranch &&
                (prev?.lane !== "branch" || prev.group !== step.group);
              const join =
                isBranch &&
                (next?.lane !== "branch" || next.group !== step.group);
              const first = i === 0;
              const last = i === steps.length - 1;
              const distance = step.state === "todo" ? i - anchor : 0;
              const fade =
                last || distance <= 0
                  ? 1
                  : Math.max(0.4, Number((1 - distance * 0.05).toFixed(2)));
              const cls = [
                "g-row",
                `g-${step.lane}`,
                `g-state-${step.state}`,
                step.tone ? `g-tone-${step.tone}` : "",
                fork ? "g-fork" : "",
                join ? "g-join" : "",
                first ? "g-first" : "",
                last ? "g-last g-goal" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <li
                  className={cls}
                  key={step.title}
                  style={{ "--fade-base": fade } as CSSProperties}
                >
                  <span className="g-rail" aria-hidden="true">
                    <span className="g-line-main" />
                    {isBranch && <span className="g-line-branch" />}
                    {fork && <span className="g-curve-fork" />}
                    {join && <span className="g-curve-join" />}
                    <span className="g-dot" />
                  </span>
                  <div className="g-body">
                    <details
                      className={`g-item${step.why || step.check ? "" : " g-item-plain"}`}
                    >
                      <summary>
                        <span className="g-mark" aria-hidden="true">
                          {STATE_MARK[step.state]}
                        </span>
                        <span className="g-title">
                          {step.title}
                          <span className="sr-only"> ({STATE_TEXT[step.state]})</span>
                          {step.branchName && (
                            <span
                              className={`g-chip${step.state === "now" ? " g-chip-head" : ""}`}
                            >
                              <span aria-hidden="true">
                                {step.state === "now" ? "HEAD → " : "⎇ "}
                              </span>
                              {step.branchName}
                            </span>
                          )}
                        </span>
                        <span className="g-when">{step.when}</span>
                      </summary>
                      {(step.why || step.check) && (
                        <dl className="g-detail">
                          {step.why && (
                            <div>
                              <dt>왜</dt>
                              <dd>{step.why}</dd>
                            </div>
                          )}
                          {step.check && (
                            <div>
                              <dt>확인</dt>
                              <dd>{step.check}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                    </details>
                  </div>
                </li>
              );
            })}
          </GraphReveal>

          <p>
            <Link href="/">← 메인으로 돌아가기</Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
