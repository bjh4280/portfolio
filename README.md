# 배종현 포트폴리오

- 배포 사이트: https://portfolio-five-lac-76.vercel.app
- 수업 실습 프로젝트: https://github.com/bjh4280/my-app

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 소개, 프로젝트 미리보기, 사용 기술, 보안 적용 내용, 연락하기 |
| `/projects` | 프로젝트 상세와 포트폴리오 변천사(v1~v7) |
| `/plans` | 앞으로의 계획 |
| `/log` | 학습 로그와 보안 점검 리포트(`/log#report`) |

## 사용 기술

- Next.js 15 (App Router), React 19, TypeScript
- MongoDB Atlas: 프로필과 문의 메시지 저장
- Resend: 문의가 오면 메일로 알림
- Vercel: GitHub에 push하면 자동 배포

## 보안 적용 내용

| 항목 | 위치 |
| --- | --- |
| 서버 측 입력값 검증 (이름·이메일·메시지 길이와 형식) | `app/api/contact/route.ts` |
| 스팸 방지용 숨김 필드(honeypot) | `components/ContactForm.tsx` |
| 요청 횟수 제한 (IP당 10분 5회) | `lib/rateLimit.ts` |
| 같은 사이트에서 온 요청만 허용 (Origin 확인) | `app/api/contact/route.ts` |
| 요청 본문 크기 제한(10KB)과 메일 제목 줄바꿈 제거 | `app/api/contact/route.ts` |
| 보안 응답 헤더 (X-Frame-Options, nosniff 등) | `next.config.mjs` |
| 취약점 제보 창구 | `public/.well-known/security.txt` |
| 비밀값을 환경변수로 분리하고 `.env*`는 커밋하지 않음 | `.gitignore` |

아직 부족한 점(CSP 미적용, 메모리 기반 횟수 제한 등)은 사이트의
[보안 점검 리포트](https://portfolio-five-lac-76.vercel.app/log#report)에 정리했습니다.

## 실행 방법

Node.js 20.6 이상이 필요합니다.

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local`이 없으면 `data/sample.json`의 내용으로 화면이 표시되고, 문의 폼은 저장되지 않습니다.

### 환경변수 (`.env.local`)

| 이름 | 설명 |
| --- | --- |
| `MONGODB_URI` | MongoDB 접속 주소 |
| `MONGODB_DB` | DB 이름 (기본값 `portfolio`) |
| `RESEND_API_KEY` | 메일 알림용 Resend API 키 (없으면 알림을 건너뜀) |
| `CONTACT_TO_EMAIL` | 문의 알림을 받을 메일 주소 |

`npm run seed`를 실행하면 `data/sample.json`의 프로필과 프로젝트를 DB에 넣습니다.
(기존 profile / projects 컬렉션은 교체됩니다.)
