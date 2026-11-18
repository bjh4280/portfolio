import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Globe, GraduationCap } from "lucide-react";

type Lesson = { problem?: string; fix?: string; learned: string };

const projects = [
  {
    no: "01",
    path: "~/projects/portfolio",
    Icon: Globe,
    // 스크린샷은 public/projects/ 폴더에 넣고 파일 이름을 여기에 적으면 카드 위에 표시됩니다.
    image: "",
    title: "개인 포트폴리오",
    year: 2026,
    summary: "지금 보고 계신 사이트입니다. 연락 폼의 메시지를 DB에 저장하고 메일로 알려줍니다.",
    stack: ["Next.js 15", "React 19", "TypeScript", "MongoDB Atlas", "Resend", "Vercel"],
    lesson: {
      problem:
        "배포한 사이트에서 '서버에 MongoDB가 연결되어 있지 않습니다' 오류가 났습니다.",
      fix: "Vercel 환경변수 이름을 코드가 읽는 MONGODB_URI로 맞추고, 값에는 연결 문자열만 넣은 뒤 다시 배포했습니다.",
      learned:
        "내 컴퓨터의 .env.local은 배포 환경에 따라가지 않아서, 환경변수는 배포 서비스에도 따로 설정해야 한다는 것을 배웠습니다.",
    } as Lesson,
    points: [
      "서버에서 이름·이메일·메시지를 검증한 뒤에만 저장",
      "숨김 입력칸(honeypot)으로 자동 스팸 차단",
      "DB 접속 정보와 API 키를 환경변수로 분리해 저장소에 올리지 않음",
      "GitHub 연동으로 push하면 Vercel이 자동 배포",
    ],
  },
  {
    no: "02",
    path: "~/projects/class-practice",
    Icon: GraduationCap,
    image: "/projects/class-practice.png",
    title: "수업 실습 프로젝트",
    year: 2026,
    summary:
      "웹 서버보안프로그래밍 수업에서 공지사항 게시판, 쇼핑몰(장바구니·주문), 회원가입·로그인 등을 간단히 실습했습니다.",
    stack: ["Next.js", "MongoDB", "Auth.js"],
    lesson: {
      learned:
        "비밀번호를 원문 그대로 저장하지 않고 해시로 저장해야 하는 이유와 방법을 익혔습니다.",
    } as Lesson,
    points: [],
  },
];

// 포트폴리오가 바뀌어 온 과정입니다. 새로 바꿀 때마다 한 줄씩 추가하세요.
// image에 public/projects/ 안의 사진을 적으면 그 버전 카드에 화면이 표시됩니다.
const history = [
  {
    version: "v1",
    image: "",
    title: "기본 구조 만들기",
    text: "Next.js와 MongoDB로 소개, 사용 기술, 연락하기 구성을 만들고 연락 메시지를 DB에 저장했습니다.",
  },
  {
    version: "v2",
    image: "/projects/portfolio.png",
    title: "내 정보 채우고 배포",
    text: "학교 로고와 소개 문구를 넣고, GitHub와 Vercel로 배포해 주소로 접속할 수 있게 했습니다.",
  },
  {
    version: "v3",
    image: "/projects/history-v3.png",
    title: "메일 알림 추가",
    text: "연락 폼으로 메시지가 오면 Resend로 메일 알림이 오도록 했습니다. 키는 환경변수로 분리했습니다.",
  },
  {
    version: "v4",
    image: "/projects/portfolio-new.png",
    title: "디자인 개편",
    text: "색과 글꼴을 바꾸고, 상단 메뉴, 페이지 전환과 스크롤 애니메이션, 아이콘을 넣었습니다.",
  },
  {
    version: "v5",
    image: "/projects/history-v5.png",
    title: "보안 컨셉 정리",
    text: "보안 적용 내용, 프로젝트, 앞으로의 계획 페이지를 추가하고 전체를 보안 컨셉으로 통일했습니다.",
  },
  {
    version: "v6",
    image: "/projects/history-v6.png",
    title: "다크 모드와 터미널",
    text: "라이트·다크 전환 버튼과, 직접 입력할 수 있는 터미널(help, projects, contact)을 추가하고 섹션 제목을 명령어 말투로 통일했습니다.",
  },
];

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
                {project.points.length > 0 && (
                  <ul className="sec-list project-points">
                    {project.points.map((point) => (
                      <li key={point}>
                        <span className="sec-ok">[OK]</span> {point}
                      </li>
                    ))}
                  </ul>
                )}
                {project.lesson && (
                  <div className="lesson">
                    <p className="lesson-title">$ cat lessons.txt</p>
                    <dl>
                      {project.lesson.problem && (
                        <>
                          <dt>겪은 문제</dt>
                          <dd>{project.lesson.problem}</dd>
                        </>
                      )}
                      {project.lesson.fix && (
                        <>
                          <dt>해결</dt>
                          <dd>{project.lesson.fix}</dd>
                        </>
                      )}
                      <dt>배운 점</dt>
                      <dd>{project.lesson.learned}</dd>
                    </dl>
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
          <div className="timeline">
            {history.map((item) => (
              <article className="project timeline-step" key={item.version}>
                <div className="timeline-node timeline-node-text" aria-hidden="true">
                  {item.version}
                </div>
                <h3 className="project-title">{item.title}</h3>
                <p className="project-summary history-text">{item.text}</p>
                {item.image && (
                  <img
                    className="project-shot history-shot"
                    src={item.image}
                    alt={`${item.version} 화면`}
                  />
                )}
              </article>
            ))}
          </div>
          <div className="sec-panel">
            <p className="sec-panel-title">수업 실습 기록</p>
            <ul className="sec-list">
              <li>파일 기반 라우팅과 서버 컴포넌트</li>
              <li>비동기 데이터 로딩 (Suspense, loading)</li>
              <li>Route Handler로 JSON API 만들기</li>
              <li>MongoDB 연동 공지사항 게시판</li>
              <li>회원가입·로그인 (비밀번호 해시 저장)</li>
              <li>장바구니와 주문 내역 (로그인한 사용자만 확인)</li>
            </ul>
          </div>
          <p>
            <Link href="/">← 메인으로 돌아가기</Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
