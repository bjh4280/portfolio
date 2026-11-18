import type { Metadata } from "next";

// 페이지마다 브라우저 탭 제목과 공유 미리보기(OG) 문구를 맞춰 주는 도우미입니다.
// 제목 뒤에는 layout.tsx의 template에 따라 " — 배종현"이 자동으로 붙습니다.
export function pageMeta(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} — 배종현`,
      description,
      type: "website",
      locale: "ko_KR",
      siteName: "배종현 포트폴리오",
    },
  };
}
