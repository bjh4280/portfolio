# 개인 포트폴리오 (Next.js + MongoDB)

프로필과 프로젝트는 MongoDB에서 읽어 오고, 방문자의 문의는 MongoDB에 저장됩니다.
MongoDB를 아직 연결하지 않아도 `data/sample.json` 의 샘플 내용으로 화면이 열립니다.

## 시작하기 (VS Code)

1. VS Code에서 이 폴더(`portfolio`)를 엽니다. 권장 확장 설치 안내가 뜨면 수락하세요.
2. 터미널(`Ctrl + ``)에서 패키지를 설치합니다. Node.js 20.6 이상이 필요합니다.

   ```bash
   npm install
   ```

3. 환경 변수 파일을 만듭니다.

   ```bash
   cp .env.example .env.local
   ```

   `.env.local` 의 `MONGODB_URI` 를 본인 MongoDB 주소로 바꿉니다.
   - 로컬 설치: `mongodb://127.0.0.1:27017`
   - Atlas(무료 클러스터): Atlas 대시보드의 Connect → Drivers 에서 연결 문자열을 복사

4. 샘플 데이터를 DB에 넣습니다.

   ```bash
   npm run seed
   ```

5. 개발 서버를 실행하고 <http://localhost:3000> 을 엽니다.

   ```bash
   npm run dev
   ```

## 내용 바꾸기

- 가장 쉬운 방법: `data/sample.json` 을 본인 정보로 수정한 뒤 `npm run seed` 를 다시 실행합니다. 기존 `profile`, `projects` 컬렉션은 교체됩니다.
- 또는 VS Code의 MongoDB 확장(MongoDB for VS Code)이나 Compass에서 `profile`, `projects` 컬렉션을 직접 수정해도 됩니다. 화면에는 최대 60초 안에 반영됩니다(`app/page.tsx` 의 `revalidate`).
- 사이트 제목은 `app/layout.tsx` 의 `metadata` 에서 바꿉니다.

## 구조

```
app/
  layout.tsx            글꼴과 메타데이터
  page.tsx              메인 페이지 (서버 컴포넌트, DB에서 데이터 조회)
  globals.css           디자인 토큰과 스타일
  api/projects/route.ts GET  프로젝트 목록
  api/contact/route.ts  POST 문의 저장 (messages 컬렉션)
components/ContactForm.tsx  문의 폼
lib/mongodb.ts          MongoDB 연결 (개발 중 연결 재사용)
lib/data.ts             프로필/프로젝트 조회, 실패 시 샘플로 대체
data/sample.json        샘플 내용과 시드 원본
scripts/seed.mjs        DB 초기 데이터 입력
```

## MongoDB 컬렉션

| 컬렉션 | 용도 | 주요 필드 |
| --- | --- | --- |
| `profile` | 소개 정보 (문서 1개) | name, role, tagline, location, available, email, about[], skills[], links[] |
| `projects` | 프로젝트 목록 | title, year, summary, description, stack[], url, repo, order |
| `messages` | 방문자 문의 | name, email, message, createdAt |

받은 문의는 MongoDB 확장이나 Compass에서 `messages` 컬렉션을 열어 확인합니다.

## 배포

Vercel에 올릴 때 프로젝트 설정의 Environment Variables 에 `MONGODB_URI`, `MONGODB_DB` 를 등록하세요.
Atlas를 쓴다면 Network Access 에서 Vercel이 접속할 수 있도록 허용 IP를 설정해야 합니다.

## 참고

- 문의 폼에는 숨김 필드 방식의 간단한 봇 차단만 들어 있습니다. 공개 후 스팸이 늘면 요청 횟수 제한을 추가하세요.
- `.env.local` 은 `.gitignore` 에 포함되어 있으니 DB 주소를 저장소에 올리지 마세요.
