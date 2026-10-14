import ContactForm from "@/components/ContactForm";
import { getPortfolio } from "@/lib/data";

// 60초마다 DB 내용을 새로 읽어 옵니다. (즉시 반영이 필요하면 0 으로 바꾸세요)
export const revalidate = 60;

export default async function Home() {
  const { profile, projects, source } = await getPortfolio();

  return (
    <main>
      <header className="hero wrap">
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-tagline">{profile.tagline}</p>
        <div className="hero-meta">
          <span>{profile.location}</span>
          <span className="status" data-open={profile.available}>
            {profile.available
              ? "새 프로젝트를 받고 있습니다"
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
              안녕하세요, 저는 ○○○입니다. 여기에 자기소개 첫 번째 문단을
              적으세요.
            </p>
            <p>
              두 번째 문단을 적으세요. 문단을 늘리려면 이 줄을 복사해서 추가하면
              됩니다.
            </p>
          </div>
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
              <p>프로젝트 제안이나 협업 문의는 폼이나 메일로 보내 주세요.</p>
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
