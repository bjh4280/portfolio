import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="section" aria-labelledby="notfound-title">
        <div className="wrap">
          <p className="hero-prompt" aria-hidden="true">
            $ cd /요청한-경로
          </p>
          <h1 className="section-title" id="notfound-title">
            404 NOT FOUND
          </h1>
          <p className="not-found-text">bash: 해당 경로를 찾을 수 없습니다.</p>
          <p>
            <Link href="/" className="btn btn-primary">
              $ cd ~ (메인으로)
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
