import Link from "next/link";
import Reveal from "@/components/Reveal";
import LogExplorer from "@/components/LogExplorer";
import { logs } from "@/lib/logs";
import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta(
  "학습 로그",
  "수업과 프로젝트에서 배운 웹 보안 내용과 이 사이트의 보안 점검 리포트입니다.",
);

export default function LogPage() {
  return (
    <main>
      <section className="section" aria-labelledby="log-title">
        <Reveal className="wrap">
          <h1 className="section-title" id="log-title">
            <span className="section-no" aria-hidden="true">
              $ git log
            </span>
            learning.log
          </h1>
          <p className="log-intro">
            개인 포트폴리오와 수업 프로젝트에서 배운 보안 내용을 나눠서 남깁니다.
            코드는 수업 자료와 제 프로젝트의 코드를 줄이거나 단순화한 예시입니다.
          </p>
          <LogExplorer logs={logs} />
          <p className="log-more">
            <span aria-hidden="true">$ </span>다음 기록은 배우는 대로 추가됩니다
            <span className="log-cursor" aria-hidden="true" />
          </p>
          <p>
            <Link href="/">← 메인으로 돌아가기</Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
