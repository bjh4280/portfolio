import ContactForm from "@/components/ContactForm";
import { getPortfolio } from "@/lib/data";

// 60초마다 DB 내용을 새로 읽어 옵니다. (즉시 반영이 필요하면 0 으로 바꾸세요)
export const revalidate = 60;

export default async function Home() {
  const { profile, projects, source } = await getPortfolio();

  return (
    <main>
      <header className="hero wrap">
        <img
          src="/school-logo.svg"
          alt="중부대학교 로고"
          className="hero-photo"
        />
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-tagline">{profile.tagline}</p>
        <div className="hero-meta">
          <span>{profile.location}</span>
          <span className="status" data-open={profile.available}>
            {profile.available
              ? "웹 서버 보안프로그래밍 과제"
              : "지금은 일정이 가득 찼습니다"}
          </span>
        </div>
      </header>

      <section className="section" id="about" aria-labelledby="about-title">
        <div className="wrap">
          <h2 className="section-title" id="about-title">
            소개
          </h2>
          <div className="about-body">
            <p>
              안녕하세요, 저는 배종현입니다. 웹 서버보안 프로그래밍 수업을
              듣고있습니다.
            </p>
            <p>
              이 사이트는 수업 과제로 만든 개인 포트폴리오입니다. Next.js로 웹
              화면을 구성하고 데이터 베이스는 MongoDB 를 활용해서 구성
              하였습니다. 주요 기능은 연락하기 메뉴를 통해서 연락처 , 메세지를
              메일로 발송하도록 했습니다.
            </p>
            <p>수업 시간에 진행한 프로젝트는 아래 링크에서 볼 수 있습니다.</p>
            <p>
              <a
                href="https://github.com/bjh4280/my-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub 저장소
              </a>
            </p>
            <p>
              <a
                href="https://vercel.com/signo6/my-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                배포된 사이트 (Vercel)
              </a>
            </p>
          </div>
        </div>
      </section>
      <section className="section" id="stack" aria-labelledby="stack-title">
        <div className="wrap">
          <h2 className="section-title" id="stack-title">
            사용 기술
          </h2>
          <dl className="skills">
            <div>
              <dt>프론트엔드</dt>
              <dd>
                Next.js 15
                <br />
                React 19
                <br />
                TypeScript
                <br />
                CSS
              </dd>
            </div>
            <div>
              <dt>백엔드 / 데이터베이스</dt>
              <dd>
                Next.js API Routes
                <br />
                MongoDB Atlas
              </dd>
            </div>
            <div>
              <dt>배포 / 도구</dt>
              <dd>
                Vercel
                <br />
                GitHub
                <br />
                VS Code
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="section" id="contact" aria-labelledby="contact-title">
        <div className="wrap">
          <h2 className="section-title" id="contact-title">
            연락하기
          </h2>
          <div className="contact-grid">
            <ContactForm />
            <aside className="contact-aside">
              <p>아래 이메일로 연락주세요.</p>
              <a className="contact-email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <ul>
                {profile.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <p>
            © {new Date().getFullYear()} {profile.name}
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
