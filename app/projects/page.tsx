import Link from "next/link";
import Reveal from "@/components/Reveal";
import HistoryTimeline from "@/components/HistoryTimeline";
import { ArrowUpRight, Globe, GraduationCap } from "lucide-react";
import { pageMeta } from "@/lib/siteMeta";

const projects = [
  {
    no: "01",
    path: "~/projects/portfolio",
    Icon: Globe,
    // 스크린샷은 public/projects/ 폴더에 넣고 파일 이름을 여기에 적으면 카드 위에 표시됩니다.
    image: "",
    title: "개인 포트폴리오",
    links: [
      { label: "GitHub 저장소", href: "https://github.com/bjh4280/portfolio" },
    ],
    year: 2026,
    summary: "지금 보고 계신 사이트입니다. 연락 폼의 메시지를 DB에 저장하고 메일로 알려줍니다.",
    stack: ["Next.js 15", "React 19", "TypeScript", "MongoDB Atlas", "Resend", "Vercel"],
    points: [
      "서버에서 이름·이메일·메시지를 검증한 뒤에만 저장",
      "숨김 입력칸(honeypot)으로 자동 스팸 차단",
      "DB 접속 정보와 API 키를 환경변수로 분리해 저장소에 올리지 않음",
      "GitHub 연동으로 push하면 Vercel이 자동 배포",
    ],
    practice: [] as string[],
  },
  {
    no: "02",
    path: "~/projects/class-practice",
    Icon: GraduationCap,
    image: "/projects/class-practice.png",
    title: "수업 실습 프로젝트",
    links: [
      { label: "배포 사이트 보기", href: "https://my-app-omega-jet-19.vercel.app/" },
      { label: "GitHub 저장소", href: "https://github.com/bjh4280/my-app" },
    ],
    year: 2026,
    summary:
      "웹 서버보안프로그래밍 수업에서 공지사항 게시판, 쇼핑몰(장바구니·주문), 회원가입·로그인 등을 간단히 실습했습니다.",
    stack: ["Next.js", "MongoDB", "Auth.js"],
    points: [],
    practice: [
      "파일 기반 라우팅과 서버 컴포넌트",
      "비동기 데이터 로딩 (Suspense, loading)",
      "Route Handler로 JSON API 만들기",
      "MongoDB 연동 공지사항 게시판",
      "회원가입·로그인 (비밀번호 해시 저장)",
      "장바구니와 주문 내역 (로그인한 사용자만 확인)",
    ],
  },
];

// 포트폴리오가 바뀌어 온 과정입니다. 새로 바꿀 때마다 한 줄씩 추가하세요.
// image에 public/projects/ 안의 사진을 적으면 그 버전 카드에 화면이 표시됩니다.
const history = [
  {
    version: "v1",
    image: "/projects/portfolio.png",
    title: "기본 구조 만들기",
    text: "Next.js와 MongoDB로 소개, 사용 기술, 연락하기 구성을 만들고 연락 메시지를 DB에 저장했습니다.",
  },
  {
    version: "v2",
    image: "/projects/portfolio-new.png",
    title: "배포와 디자인 개편",
    text: "학교 로고와 소개 문구를 넣고 GitHub와 Vercel로 배포했습니다. 메일 알림(Resend)을 붙이고, 색·글꼴·상단 메뉴·애니메이션으로 디자인을 개편했습니다.",
  },
  {
    version: "v3",
    image: "/projects/history-v5.png",
    title: "보안 컨셉 정리",
    text: "보안 적용 내용, 프로젝트, 앞으로의 계획 페이지를 추가하고 전체를 보안 컨셉으로 통일했습니다.",
  },
  {
    version: "v4",
    image: "/projects/history-v6.png",
    title: "다크 모드와 터미널",
    text: "라이트·다크 전환 버튼과, 직접 입력할 수 있는 터미널(help, projects, contact)을 추가하고 섹션 제목을 명령어 말투로 통일했습니다.",
  },
  {
    version: "v5",
    image: "/projects/history-code.png",
    narrow: true,
    title: "실제 보안 적용",
    text: "문의 폼에 요청 횟수 제한(10분에 5번), 같은 사이트에서 온 요청만 허용하는 Origin 확인, 본문 크기 제한을 넣고 보안 응답 헤더와 security.txt를 추가했습니다.",
  },
  {
    version: "v6",
    image: "/projects/history-log.png",
    title: "학습 로그와 점검 리포트",
    text: "수업에서 배운 보안 내용을 코드와 함께 정리한 학습 로그를 만들고, 방어한 것과 아직 부족한 점을 적은 보안 점검 리포트를 추가했습니다.",
  },
  {
    version: "v7",
    image: "/projects/history-v7.png",
    title: "소개와 연락하기 다듬기",
    text: "소개에 강점 카드를 넣고 연락하기를 터미널 말투로 바꿨습니다. 페이지별 제목과 링크 미리보기 이미지도 추가했습니다.",
  },
];

export const metadata = pageMeta(
  "프로젝트",
  "개인 포트폴리오와 수업 실습 프로젝트, 그리고 포트폴리오가 바뀐 과정을 보여줍니다.",
);

export default function ProjectsPage() {
  return (
    <main>
      <section className="section" aria-labelledby="projects-title">
        <Reveal className="wrap">
          <h1 className="section-title" id="projects-title">
            <span className="section-no" aria-hidden="true">
              $ ls
            </span>
            projects/
          </h1>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.no}>
                <div className="window-bar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <code>{project.path}</code>
                </div>
                {project.image ? (
                  <img
                    className="project-shot"
                    src={project.image}
                    alt={`${project.title} 화면`}
                  />
                ) : (
                  <div className="project-visual" aria-hidden="true">
                    <project.Icon size={44} strokeWidth={1.25} />
                    <span className="project-visual-no">{project.no}</span>
                  </div>
                )}
                <p className="project-meta">
                  {project.no} · {project.year}
                </p>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-summary">{project.summary}</p>
                <ul className="tags">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <ul className="project-links">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                {project.points.length > 0 && (
                  <ul className="sec-list project-points">
                    {project.points.map((point) => (
                      <li key={point}>
                        <span className="sec-ok">[OK]</span> {point}
                      </li>
                    ))}
                  </ul>
                )}
                {project.practice.length > 0 && (
                  <div className="lesson">
                    <p className="lesson-title">$ cat practice.txt</p>
                    <ul className="sec-list">
                      {project.practice.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
          <h2 className="subhead">
            <span className="section-no" aria-hidden="true">
              $ git log
            </span>
            포트폴리오 변천사
          </h2>
          <HistoryTimeline items={history} />
          <p>
            <Link href="/">← 메인으로 돌아가기</Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
