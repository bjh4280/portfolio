import type { Metadata } from "next";
import { Bricolage_Grotesque, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const siteTitle = "배종현 포트폴리오 — 정보보호학과 · 웹 개발";
const siteDescription =
  "중부대학교 정보보호학과 2학년 배종현의 포트폴리오. 보안을 생각하며 웹을 만들고 배포합니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-five-lac-76.vercel.app"),
  title: { default: siteTitle, template: "%s — 배종현" },
  description: siteDescription,
  twitter: { card: "summary_large_image" },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "ko_KR",
    siteName: "배종현 포트폴리오",
  },
};

// 처음 그릴 때 저장된 테마를 먼저 적용해서 화면이 번쩍이지 않게 합니다.
// 저장된 값이 없으면 라이트로 시작합니다. (다크로 시작하려면 "light"를 "dark"로)
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t="light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

// 홈에 처음 들어온 방문자에게만 접속 화면을 보여 주기 위한 표시입니다.
// 화면이 준비되기 전까지 홈 내용이 번쩍 보이지 않게 가리고, 4초 안에 준비되지 않으면 풉니다.
const gateScript = `(function(){try{if(location.pathname!=="/")return;if(sessionStorage.getItem("gate-seen"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.dataset.gate="pending";setTimeout(function(){if(d.dataset.gate==="pending")delete d.dataset.gate},4000)}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: gateScript }} />
      </head>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
