import ContactForm from "@/components/ContactForm";
import { getPortfolio } from "@/lib/data";
import Link from "next/link";
import HeroTerminal from "@/components/HeroTerminal";
import Reveal from "@/components/Reveal";
import EntryGate from "@/components/EntryGate";
import TypedCmd from "@/components/TypedCmd";
import { logs } from "@/lib/logs";

import {
  ArrowUpRight,
  Database,
  Flame,
  Mail,
  Monitor,
  Search,
  ShieldCheck,
} from "lucide-react";

const previews = [
  {
    path: "~/projects/portfolio",
    title: "개인 포트폴리오",
    summary: "연락 폼의 메시지를 DB에 저장하고 메일로 알려줍니다.",
    image: "/projects/portfolio-new.png",
    stack: ["Next.js", "MongoDB", "Resend"],
    links: [
      { label: "GitHub 저장소", href: "https://github.com/bjh4280/portfolio" },
    ],
  },
  {
    path: "~/projects/class-practice",
    title: "수업 실습 프로젝트",
    summary: "공지사항 게시판, 쇼핑몰, 회원가입·로그인을 실습했습니다.",
    image: "/projects/class-practice.png",
    stack: ["Next.js", "MongoDB", "Auth.js"],
    links: [
      { label: "배포 사이트 보기", href: "https://my-app-omega-jet-19.vercel.app/" },
      { label: "GitHub 저장소", href: "https://github.com/bjh4280/my-app" },
    ],
  },
];

// 60초마다 DB 내용을 새로 읽어 옵니다. (즉시 반영이 필요하면 0 으로 바꾸세요)
export const revalidate = 60;

export default async function Home() {
  const { profile, source } = await getPortfolio();

  return (
    <main>
      <EntryGate />
      <header className="hero hero-grid wrap">
        <div className="hero-main">
          <div className="hero-top">
            <img
              src="/school-logo.svg"
              alt="중부대학교 로고"
              className="hero-logo"
            />
            <p className="hero-prompt" aria-hidden="true">
              $ whoami
            </p>
          </div>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-role">
            중부대학교 정보보호학과 2학년{" "}
            <span className="nowrap">· 웹 개발</span>{" "}
            <span className="nowrap">· 보안</span>
          </p>
          <p className="hero-tagline">
            보안을 생각하며 웹을 만들고 배포합니다.
          </p>
          <div className="hero-actions">
            <Link href="/projects" className="btn btn-primary">
              ./projects
            </Link>
            <a href="#contact" className="btn btn-ghost">
              ./contact
            </a>
          </div>
        </div>

        <HeroTerminal name={profile.name} email={profile.email} />

        <div className="hero-meta">
          <span>{profile.location}</span>
          <span className="status" data-open={profile.available}>
            {profile.available
              ? "웹 서버 보안프로그래밍 수강 중 · 연락 환영"
              : "지금은 답장이 늦을 수 있습니다"}
          </span>
        </div>
      </header>

      <section className="stat-band" aria-label="한눈에 보기">
        <Reveal className="wrap">
          <dl className="stat-row">
            <div className="stat">
              <dt className="stat-label">학습 로그</dt>
              <dd className="stat-num">{logs.length}</dd>
            </div>
            <div className="stat">
              <dt className="stat-label">직접 방어한 취약점</dt>
              <dd className="stat-num">{logs.filter((l) => l.vuln).length}</dd>
            </div>
            <div className="stat">
              <dt className="stat-label">프로젝트</dt>
              <dd className="stat-num">{previews.length}</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="section" id="about" aria-labelledby="about-title">
        <Reveal className="wrap">
          <h2 className="section-title" id="about-title">
            <TypedCmd className="section-no" text="$ cat about.md" />
            소개
          </h2>
          <div className="about-body">
            <p>
              안녕하세요, 수업에서 배운 웹 보안을 이 포트폴리오에 직접 적용해 본
              배종현입니다. 중부대학교 정보보호학과 2학년이며, 웹
              서버 보안프로그래밍 수업을 듣고 있습니다.
            </p>
            <p>
              이 사이트는 수업 과제로 만든 개인 포트폴리오입니다. Next.js로
              화면을 만들고 MongoDB에 데이터를 저장하며, 연락하기에서 보낸
              메시지는 메일로 전달됩니다.
            </p>
            <p>수업 시간에 진행한 프로젝트는 아래에서 볼 수 있습니다.</p>
          </div>
          <p className="strengths-label">
            <span aria-hidden="true">$ </span>cat strengths.txt
          </p>
          <ul className="strengths">
            <li className="strength">
              <Flame size={22} strokeWidth={1.5} className="icon" aria-hidden="true" />
              <h3 className="strength-title">포기하지 않는 끈기</h3>
              <p>
                배포 오류가 나도 원인을 끝까지 찾아 고쳤고, 이 포트폴리오도 일곱
                단계로 계속 다듬어 왔습니다.
              </p>
            </li>
            <li className="strength">
              <ShieldCheck size={22} strokeWidth={1.5} className="icon" aria-hidden="true" />
              <h3 className="strength-title">서버에서 다시 확인하는 습관</h3>
              <p>
                입력값, 권한, 가격처럼 사용자가 보낸 값은 서버에서 다시 확인하도록
                만들었습니다.
              </p>
            </li>
            <li className="strength">
              <Search size={22} strokeWidth={1.5} className="icon" aria-hidden="true" />
              <h3 className="strength-title">스스로 점검하는 태도</h3>
              <p>
                방어한 것뿐 아니라 아직 부족한 점도 보안 점검 리포트에 솔직하게
                기록합니다.
              </p>
            </li>
          </ul>
        </Reveal>
      </section>
      <section className="section section-alt" id="projects" aria-labelledby="projects-title">
        <Reveal className="wrap">
          <h2 className="section-title" id="projects-title">
            <TypedCmd className="section-no" text="$ ls projects/" />
            프로젝트
          </h2>
          <div className="preview-grid">
            {previews.map((item) => (
              <article className="project" key={item.title}>
                <div className="window-bar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <code>{item.path}</code>
                </div>
                {item.image && (
                  <img
                    className="project-shot"
                    src={item.image}
                    alt={`${item.title} 화면`}
                  />
                )}
                <h3 className="project-title">{item.title}</h3>
                <p className="project-summary">{item.summary}</p>
                <ul className="tags">
                  {item.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <ul className="project-links">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p>
            <Link className="icon-link" href="/projects">
              전체 프로젝트 보기
              <ArrowUpRight size={16} strokeWidth={1.5} className="icon icon-arrow" aria-hidden="true" />
            </Link>
          </p>
        </Reveal>
      </section>
      <section className="section" id="stack" aria-labelledby="stack-title">
        <Reveal className="wrap">
          <h2 className="section-title" id="stack-title">
            <TypedCmd className="section-no" text="$ ls stack/" />
            사용 기술
          </h2>
          <dl className="skills">
            <div>
              <dt>
                <Monitor size={18} strokeWidth={1.5} className="icon" aria-hidden="true" />
                웹 개발
              </dt>
              <dd>
                <ul className="tags">
                  <li>Next.js 15</li>
                  <li>React 19</li>
                  <li>TypeScript</li>
                  <li>CSS</li>
                </ul>
              </dd>
            </div>
            <div>
              <dt>
                <Database size={18} strokeWidth={1.5} className="icon" aria-hidden="true" />
                데이터 · 배포
              </dt>
              <dd>
                <ul className="tags">
                  <li>MongoDB Atlas</li>
                  <li>Vercel</li>
                  <li>GitHub</li>
                </ul>
              </dd>
            </div>
            <div>
              <dt>
                <ShieldCheck size={18} strokeWidth={1.5} className="icon" aria-hidden="true" />
                정보보호
              </dt>
              <dd>
                <ul className="tags">
                  <li>입력값 검증</li>
                  <li>요청 횟수 제한</li>
                  <li>환경변수 분리</li>
                  <li>보안 응답 헤더</li>
                </ul>
              </dd>
            </div>
          </dl>
          <div className="sec-panel">
            <p className="sec-panel-title">
              <ShieldCheck size={18} strokeWidth={1.5} className="icon" aria-hidden="true" />
              보안 적용 내용
            </p>
            <ul className="sec-list">
              <li>
                <span className="sec-ok">[OK]</span> 서버 측 입력값 검증 (이름·이메일·메시지)
              </li>
              <li>
                <span className="sec-ok">[OK]</span> 스팸 방지용 숨김 필드(honeypot)
              </li>
              <li>
                <span className="sec-ok">[OK]</span> DB 접속 정보·API 키를 환경변수로 분리
              </li>
              <li>
                <span className="sec-ok">[OK]</span> Vercel 배포로 HTTPS 통신
              </li>
              <li>
                <span className="sec-ok">[OK]</span> 문의 폼 요청 횟수 제한 (IP당 10분 5회)
              </li>
              <li>
                <span className="sec-ok">[OK]</span> 같은 사이트에서 온 요청만 허용 (Origin 확인)
              </li>
              <li>
                <span className="sec-ok">[OK]</span> 보안 응답 헤더 (클릭재킹·MIME 스니핑 방지)
              </li>
              <li>
                <span className="sec-ok">[OK]</span> 취약점 제보 창구 (security.txt)
              </li>
            </ul>
            <p className="sec-more">
              <Link href="/log#report">
                점검 결과와 남은 한계 보기 <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </Reveal>
      </section>
      <section className="section section-alt" id="contact" aria-labelledby="contact-title">
        <Reveal className="wrap">
          <h2 className="section-title" id="contact-title">
            <TypedCmd className="section-no" text="$ ./contact" />
            연락하기
          </h2>
          <div className="contact-grid">
            <div>
              <p className="contact-lead">
                궁금한 점이나 이야기하고 싶은 것이 있으면 편하게 남겨 주세요.
                확인 후 메일로 답장드리겠습니다.
              </p>
              <ContactForm />
            </div>
            <aside className="contact-aside">
              <div className="contact-card">
                <p className="contact-card-title">$ cat contact.txt</p>
                <a
                  className="contact-email icon-link"
                  href={`mailto:${profile.email}`}
                >
                  <Mail size={18} strokeWidth={1.5} className="icon" aria-hidden="true" />
                  {profile.email}
                </a>
                <p>폼 대신 메일로 바로 보내셔도 됩니다.</p>
              </div>
            </aside>
          </div>
        </Reveal>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a
              href="https://github.com/bjh4280/portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="footer-exit" aria-hidden="true">
            $ exit
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="dev-note">
              개발 모드: 데이터를{" "}
              {source === "mongodb" ? "MongoDB" : "샘플 파일(data/sample.json)"}
              에서 읽고 있습니다.
            </p>
          )}
        </div>
      </footer>
    </main>
  );
}
