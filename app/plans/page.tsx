import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Cloud, Rocket, ShieldCheck } from "lucide-react";

// 내용은 초안입니다. 본인의 실제 계획에 맞게 문장을 고쳐 쓰세요.
const plans = [
  {
    no: "01",
    Icon: ShieldCheck,
    when: "지금 ~ 2학년",
    title: "웹 보안 기초 다지기",
    items: ["OWASP Top 10 정리", "수업 프로젝트에 입력값 검증 보완"],
  },
  {
    no: "02",
    Icon: Cloud,
    when: "3학년",
    title: "배포와 클라우드 보안",
    items: ["서비스 배포와 권한 관리 익히기", "점검 도구 직접 써 보기"],
  },
  {
    no: "03",
    Icon: Rocket,
    when: "졸업 전",
    title: "보안을 아는 웹 개발자",
    items: ["보안을 설계한 프로젝트 완성", "자격증·대회 도전"],
  },
];

export default function PlansPage() {
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
          <div className="goal-block">
            <p className="goal-label">$ cat goal.txt</p>
            <p className="goal">
              보안을 이해하고 직접 구현하는 웹 개발자가 되고 싶습니다.
            </p>
            <p className="goal-sub">
              기능을 만드는 데서 끝내지 않고, 방어까지 설계하는 것이 목표입니다.
            </p>
          </div>
          <div className="timeline plan-timeline">
            {plans.map((plan) => (
              <article className="plan-step" key={plan.no}>
                <div className="timeline-node" aria-hidden="true">
                  <plan.Icon size={20} strokeWidth={1.5} />
                </div>
                <p className="project-meta">
                  {plan.no} · {plan.when}
                </p>
                <h2 className="project-title">{plan.title}</h2>
                <ul className="plan-items">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p>
            <Link href="/">← 메인으로 돌아가기</Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
