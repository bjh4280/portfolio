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
    items: [
      "OWASP Top 10 취약점(인젝션, XSS 등)의 원리와 대응 방법 정리",
      "수업에서 만든 프로젝트에 입력값 검증과 인증 보완",
      "Git과 GitHub로 작업 기록을 꾸준히 남기기",
    ],
  },
  {
    no: "02",
    Icon: Cloud,
    when: "3학년",
    title: "배포와 클라우드 보안 익히기",
    items: [
      "클라우드 환경에서 서비스를 배포하고 접근 권한을 관리하는 방법 학습",
      "로그 확인과 취약점 점검 도구 사용해 보기",
      "작은 프로젝트를 직접 만들어 운영해 보기",
    ],
  },
  {
    no: "03",
    Icon: Rocket,
    when: "졸업 전",
    title: "보안을 아는 웹 개발자로 성장",
    items: [
      "보안을 고려해 설계한 프로젝트로 포트폴리오 보강",
      "관련 자격증과 대회 도전",
      "진로 방향을 정하고 인턴·실무 경험 쌓기",
    ],
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
          <div className="timeline">
            {plans.map((plan) => (
              <article className="project timeline-step" key={plan.no}>
                <div className="timeline-node" aria-hidden="true">
                  <plan.Icon size={20} strokeWidth={1.5} />
                </div>
                <p className="project-meta">
                  {plan.no} · {plan.when}
                </p>
                <h2 className="project-title">{plan.title}</h2>
                <ul className="sec-list project-points">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <span className="sec-ok">[ ]</span> {item}
                    </li>
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
