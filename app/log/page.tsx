import Link from "next/link";
import Reveal from "@/components/Reveal";
import LogExplorer, { type LogEntry } from "@/components/LogExplorer";
import { pageMeta } from "@/lib/siteMeta";

// 새로 배운 것이 생기면 해당 프로젝트(project)의 다음 번호로 한 항목씩 추가하세요.
// project: "portfolio"(개인 포트폴리오) 또는 "class"(수업 프로젝트)
// check: 수업 자료의 "확인해보기" 단계 (있으면 "확인 방법" 줄이 붙습니다)
// before: 취약했던 코드(있으면 [VULN] / [FIXED] 전환 버튼이 생깁니다)
// vuln: true면 "직접 방어한 취약점" 숫자에 포함됩니다.
const logs: LogEntry[] = [
  {
    project: "portfolio",
    no: "01",
    status: "done",
    tag: "server-side",
    title: "비밀값과 DB 접근은 서버에서만",
    learned:
      "데이터 처리와 비밀값은 서버 쪽에 두고, 브라우저에는 결과만 보내는 구조를 익혔습니다.",
    file: "route.ts",
    code: "// 서버에서만 실행되는 Route Handler\nexport async function GET() {\n  const items = await getProjects();   // DB 접근은 서버에서\n  return Response.json(items);\n}",
    vuln: false,
  },
  {
    project: "portfolio",
    no: "02",
    status: "done",
    tag: "validation",
    title: "문의 폼 입력값 검증과 스팸 방지",
    learned:
      "사용자 입력은 서버에서 다시 검증해야 합니다. 화면에서 막는 것만으로는 우회할 수 있습니다.",
    file: "validate.ts",
    code: "// 입력값은 서버에서 다시 검증한다\nif (body.website) return ok();   // honeypot\nif (!isEmail(email) || message.length > 2000) {\n  return Response.json({ error: \"invalid\" }, { status: 400 });\n}",
    vuln: false,
  },
  {
    project: "portfolio",
    no: "03",
    status: "done",
    tag: "secrets",
    title: "접속 정보를 .env 파일로 분리",
    learned:
      "DB 주소와 API 키를 코드에 적지 않고 환경변수로 읽으면, 저장소가 공개돼도 비밀이 새지 않습니다.",
    file: ".env.local",
    code: "# 저장소에 올리지 않는 파일\nMONGODB_URI=\"mongodb+srv://...\"\nRESEND_API_KEY=\"re_...\"",
    vuln: false,
  },
  {
    project: "portfolio",
    no: "04",
    status: "done",
    tag: "secrets",
    title: "비밀값은 GitHub에 올리지 않기",
    learned:
      "코드는 GitHub에 올리고, 비밀값은 배포 서비스의 환경변수에만 넣어야 합니다.",
    file: ".gitignore",
    code: "# 비밀값과 빌드 결과는 GitHub에 올리지 않는다\n.env*\nnode_modules/\n.next/",
    vuln: false,
  },
  {
    project: "portfolio",
    no: "05",
    status: "done",
    tag: "rate-limit",
    title: "문의 폼 요청 횟수 제한",
    learned:
      "같은 IP가 문의 폼을 계속 보내 DB와 메일함을 채우지 못하도록 10분에 5번으로 제한했습니다. 메모리에 저장하는 방식이라 서버가 여러 대면 카운터가 따로 놀기 때문에, 실무에서는 Redis 같은 공유 저장소가 필요합니다.",
    file: "route.ts",
    code: "// IP당 10분에 5번까지만 받는다\nconst limit = checkRateLimit(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000);\nif (!limit.allowed) {\n  return NextResponse.json({ error: \"너무 자주 보냈습니다.\" }, { status: 429 });\n}",
    check: "문의를 6번 연속 보내면 6번째에 '너무 자주 보냈습니다' 응답(429)이 오는지 확인",
    before: "// 요청 횟수 제한이 없다\n// 같은 IP가 문의를 무한히 보내 DB와 메일함을 채울 수 있다\nawait client.db(dbName).collection(\"messages\").insertOne({ name, email, message });",
    vuln: true,
  },
  {
    project: "portfolio",
    no: "06",
    status: "done",
    tag: "csrf",
    title: "같은 사이트에서 보낸 요청만 받기",
    learned:
      "브라우저는 다른 사이트에서 보내는 POST 요청에도 Origin 헤더를 붙입니다. 이 값이 우리 주소와 다르면 403으로 거절해, 다른 사이트의 폼이나 스크립트가 몰래 문의를 보내는 것을 막습니다. 다만 Origin은 브라우저 밖(curl 등)에서는 바꿀 수 있어서, 횟수 제한과 입력 검증이 함께 필요합니다.",
    file: "route.ts",
    code: "const origin = request.headers.get(\"origin\");\n// Origin이 있는데 우리 주소와 다르면 거절한다\nif (origin && new URL(origin).host !== request.headers.get(\"host\")) {\n  return NextResponse.json({ error: \"허용되지 않은 요청입니다.\" }, { status: 403 });\n}",
    before: "// 요청이 어느 사이트에서 왔는지 확인하지 않는다\nconst body = await request.json();",
    vuln: true,
  },
  {
    project: "portfolio",
    no: "07",
    status: "done",
    tag: "headers",
    title: "보안 응답 헤더 적용",
    learned:
      "코드에 버그가 없어도 다른 사이트가 우리 페이지를 iframe에 넣거나(클릭재킹), 브라우저가 파일 형식을 제멋대로 해석하는 것을 응답 헤더로 막을 수 있습니다. CSP는 테마 스크립트 때문에 추가 설정이 필요해서 이번에는 넣지 않았습니다.",
    file: "next.config.mjs",
    code: "async headers() {\n  return [{ source: \"/:path*\", headers: [\n    { key: \"X-Content-Type-Options\", value: \"nosniff\" },\n    { key: \"X-Frame-Options\", value: \"DENY\" },\n    { key: \"Referrer-Policy\", value: \"strict-origin-when-cross-origin\" },\n  ] }];\n},",
    check: "터미널에서 curl -I http://localhost:3000/ 으로 응답 헤더에 X-Frame-Options가 있는지 확인",
    before: "// 보안 헤더 설정이 없다\n// 다른 사이트가 이 페이지를 iframe에 넣을 수 있다 (클릭재킹)",
    vuln: true,
  },
  {
    project: "portfolio",
    no: "08",
    status: "done",
    tag: "disclosure",
    title: "취약점 제보 창구 (security.txt)",
    learned:
      "보안 연구자가 취약점을 발견했을 때 어디로 알리면 되는지 알려 주는 표준 파일(RFC 9116)입니다. /.well-known/security.txt 경로에 연락처와 유효 기간을 적어 두었습니다.",
    file: "security.txt",
    code: "Contact: mailto:bjh4280@gmail.com\nExpires: 2027-11-01T00:00:00.000Z\nPreferred-Languages: ko, en\nCanonical: https://portfolio-five-lac-76.vercel.app/.well-known/security.txt",
    check: "배포 후 /.well-known/security.txt 주소가 열리는지 확인. 유효 기간(Expires) 전에 갱신",
    vuln: false,
  },
  {
    project: "portfolio",
    no: "09",
    status: "done",
    tag: "input",
    title: "요청 크기 제한과 메일 제목 정리",
    learned:
      "너무 큰 요청 본문은 읽기 전에 거절해 서버 자원을 아끼고, 메일 제목에 들어가는 이름의 줄바꿈은 지워 메일 헤더를 오염시키지 못하게 했습니다.",
    file: "route.ts",
    code: "// 본문이 너무 크면 읽기 전에 거절한다\nif (Number(request.headers.get(\"content-length\") ?? 0) > MAX_BODY_BYTES) {\n  return NextResponse.json({ error: \"요청이 너무 큽니다.\" }, { status: 413 });\n}\n// 메일 제목에 줄바꿈이 들어가지 않게 정리한다\nconst safeName = data.name.replace(/[\\r\\n]+/g, \" \");",
    vuln: false,
  },
  {
    project: "class",
    no: "01",
    status: "done",
    tag: "auth",
    title: "회원가입·로그인과 비밀번호 해시",
    learned:
      "비밀번호는 원문이 아니라 해시로 저장합니다. DB가 유출되어도 원래 비밀번호를 바로 알 수 없게 하기 위해서입니다.",
    file: "auth.ts",
    code: "// 비밀번호 원문 대신 해시를 저장한다\nconst hash = await bcrypt.hash(password, 10);\n// 로그인할 때는 입력값과 해시를 비교한다\nconst ok = await bcrypt.compare(input, user.hash);",
    vuln: false,
  },
  {
    project: "class",
    no: "02",
    status: "done",
    tag: "session",
    title: "로그인 상태는 서명된 JWT 세션 쿠키로",
    learned:
      "로그인 정보를 서버가 서명한 토큰으로 쿠키에 담습니다. 서명 키(AUTH_SECRET)가 유출되면 누구나 로그인 세션을 위조할 수 있어서, MONGODB_URI처럼 .env.local에만 두고 커밋하지 않습니다.",
    file: "auth.ts",
    code: "export const { auth, signIn, signOut } = NextAuth({\n  session: { strategy: \"jwt\" },   // 서명된 세션 쿠키\n  secret: process.env.AUTH_SECRET,   // 유출되면 세션을 위조당한다\n});",
    check: "/register에서 가입 → 자동 로그인 → 헤더에서 로그아웃까지 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "03",
    status: "done",
    tag: "authz",
    title: "화면에서 버튼을 숨기는 것은 보안이 아니다",
    learned:
      "삭제 버튼을 숨기는 것은 화면(UX)일 뿐, 개발자 도구로 요청을 직접 보내면 막지 못합니다. 서버 코드 안에서 로그인 여부와 작성자 본인(또는 admin)인지 다시 확인해야 하고, 미들웨어의 라우트 차단만 믿지 않는 심층 방어이기도 합니다.",
    file: "actions.ts",
    code: "export async function deleteNoticeAction(id: string) {\n  const session = await auth();\n  if (!session) throw new Error(\"로그인이 필요합니다\");\n  const notice = await findNotice(id);\n  // 작성자 본인이거나 admin일 때만 삭제한다\n  if (notice.authorId !== session.user.id && session.user.role !== \"admin\") {\n    throw new Error(\"권한이 없습니다\");\n  }\n}",
    check: "내 글에서만 삭제 버튼이 보이고, 남의 글에서는 보이지 않는지 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "04",
    status: "done",
    tag: "rbac",
    title: "role과 소유권은 다른 질문이다",
    learned:
      "'관리자인가'(role)와 '이 글의 주인인가'(소유권)를 둘 다 확인해야 본인 글 또는 admin만 삭제가 완성됩니다. admin이 되는 화면은 일부러 만들지 않았습니다. 그 화면 자체가 공격 표면이 되기 때문에, 승격은 DB에서 직접 바꿉니다.",
    file: "User.ts",
    code: "role: {\n  type: String,\n  enum: [\"user\", \"admin\"],\n  default: \"user\",   // 가입하면 항상 일반 사용자\n},\n// admin 승격 화면은 만들지 않고 DB에서 직접 바꾼다",
    check: "Atlas에서 계정 하나를 role: \"admin\"으로 바꾼 뒤 모든 글을 삭제할 수 있는지 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "05",
    status: "done",
    tag: "input",
    title: "쿠키 값도 서버에서 다시 검증하기",
    learned:
      "httpOnly 쿠키는 자바스크립트로부터는 안전하지만 개발자 도구에서 직접 고칠 수 있습니다. 그래서 장바구니 수량도 서버에서 실제 재고 범위로 다시 검증합니다.",
    file: "actions.ts",
    code: "export async function addToCartAction(productId: string, qty: number) {\n  const product = await findProduct(productId);\n  // 쿠키·폼 값을 그대로 믿지 않고 재고 범위로 제한한다\n  const safeQty = Math.min(Math.max(1, qty), product.stock);\n}",
    check: "/products에서 상품을 담고 /cart에서 수량을 바꾸거나 삭제해 보기. 로그인하지 않아도 장바구니가 동작하는지 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "06",
    status: "done",
    tag: "server-trust",
    title: "결제할 때 가격과 재고는 서버가 다시 조회",
    learned:
      "가격 같은 민감한 값을 클라이언트가 들고 있는 저장소에 두면 조작할 수 있습니다. 장바구니에는 상품 id와 수량만 두고, 결제할 때 가격과 재고는 DB에서 다시 읽어 주문을 만듭니다.",
    file: "checkout.ts",
    code: "// 장바구니 쿠키에는 상품 id와 수량만 둔다\nconst items = await loadProducts(cart.map((c) => c.productId));\n// 가격은 항상 DB에서 읽은 값으로 계산한다\nconst total = items.reduce((sum, p, i) => sum + p.price * cart[i].qty, 0);",
    check: "로그인 후 상품을 담고 결제하기 → 주문 상세로 이동하는지 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "07",
    status: "done",
    tag: "idor",
    title: "권한이 없을 땐 403 대신 404",
    learned:
      "403으로 응답하면 '그 번호의 주문은 존재한다'는 정보가 새어 나갑니다. 내 주문이 아니면 존재하지 않는 것처럼 404로 응답합니다.",
    file: "order.tsx",
    code: "// 403(권한 없음)은 \"그 주문이 있다\"는 사실을 알려 준다\n// return new Response(\"Forbidden\", { status: 403 });\nif (!order || !canAccess(order, user)) notFound();   // 404로 통일",
    check: "다른 계정으로 로그인해 그 주문 id로 직접 접근하면 404가 뜨는지 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "08",
    status: "done",
    tag: "review",
    title: "정적 분석이 못 잡는 취약점",
    learned:
      "tsc와 eslint는 경고 없이 통과했지만, 두 코드 모두 취약했습니다. 문법이 맞다고 안전한 것은 아니어서, 코드 리뷰와 보안 점검이 따로 필요합니다.",
    file: "lint-pass.ts",
    code: "// tsc·eslint는 통과하지만 취약한 코드\n<div dangerouslySetInnerHTML={{ __html: notice.content }} />\nconst secret = process.env.AUTH_SECRET || \"dev-secret\";",
    check: "npx tsc --noEmit, npx eslint . 모두 경고 없이 통과하는 것을 확인",
    vuln: false,
  },
  {
    project: "class",
    no: "09",
    status: "done",
    tag: "xss",
    title: "저장형 XSS: 자동 이스케이프를 끄지 않기",
    learned:
      "공지에 넣은 스크립트가 DB에 저장되면 글을 여는 모든 사람의 브라우저에서 실행됩니다. 줄바꿈은 CSS(whitespace-pre-wrap)만으로 충분해서, 위험한 API가 처음부터 필요 없었습니다.",
    file: "notice.tsx",
    code: "// before: 사용자 입력을 HTML로 그대로 해석한다\n<div dangerouslySetInnerHTML={{ __html: notice.content }} />\n// after: {값}은 React가 자동으로 이스케이프한다\n<p className=\"whitespace-pre-wrap\">{notice.content}</p>",
    check: "공지에 <script>alert(1)</script>를 저장하고 열어 보기 → 경고창 대신 글자 그대로 표시되는지 확인",
    before: "// 줄바꿈을 <br>로 바꾸려고 HTML로 그대로 넣었다\n<div dangerouslySetInnerHTML={{ __html: notice.content.replace(/\\n/g, \"<br>\") }} />\n// content에 <script>alert(1)</script>가 있으면 실행된다",
    vuln: true,
  },
  {
    project: "class",
    no: "10",
    status: "done",
    tag: "secrets",
    title: "시크릿은 없으면 바로 실패시키기 (fail fast)",
    learned:
      "코드에 기본 시크릿을 적어 두면 저장소가 공개될 때 로그인 세션을 위조당할 수 있습니다. 값이 없으면 조용히 넘어가지 않고 시작 단계에서 멈추게 했고, 인증 없이 환경변수를 보여주던 디버그 경로는 삭제했습니다.",
    file: "auth.ts",
    code: "const secret = process.env.AUTH_SECRET;\nif (!secret) {\n  // 기본값을 쓰지 않고 바로 실패한다\n  throw new Error(\"AUTH_SECRET 환경변수가 없습니다.\");\n}",
    check: "/api/debug/env가 404인지, AUTH_SECRET을 지우고 서버를 켜면 에러와 함께 멈추는지 확인",
    before: "// 환경변수가 없으면 코드에 적힌 기본값을 쓴다\nsecret: process.env.AUTH_SECRET || \"dev-secret-please-change-me\",\n// 인증 없이 환경변수를 그대로 돌려주던 디버그 경로\n// app/api/debug/env/route.ts",
    vuln: true,
  },
  {
    project: "class",
    no: "11",
    status: "done",
    tag: "nosql",
    title: "NoSQL 인젝션: 입력의 타입 확인과 이스케이프",
    learned:
      "MongoDB 쿼리는 객체라서 { \"$ne\": null } 같은 입력이 들어오면 조건이 바뀔 수 있습니다. 문자열인지 확인하고, 정규식에 넣는 값은 특수문자를 이스케이프했습니다.",
    file: "products.ts",
    code: "function escapeRegExp(text: string): string {\n  return text.replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\");\n}\n// 이스케이프한 뒤에만 $regex에 사용한다\nProductModel.find({ name: { $regex: escapeRegExp(q), $options: \"i\" } });",
    check: "/products?q=.* 처럼 특수문자를 넣어도 에러 없이 글자 그대로 검색되는지 확인",
    before: "// 사용자 입력을 그대로 정규식으로 사용한다\nProductModel.find({ name: { $regex: rawQuery } });\n// rawQuery가 객체나 정규식 특수문자면 조건이 바뀐다",
    vuln: true,
  },
  {
    project: "class",
    no: "12",
    status: "done",
    tag: "idor",
    title: "IDOR: 로그인(인증)과 권한(인가)은 다르다",
    learned:
      "로그인만 확인하면 다른 사람의 주문 번호로도 상세 내역이 보입니다. 내 주문인지, 관리자인지까지 서버에서 확인하는 몇 줄이 유일한 방어선이었습니다.",
    file: "order.tsx",
    code: "// 로그인(인증)만으로는 부족하다. 내 것인지(인가)도 확인한다\nconst isOwner = order.userId === session.user.id;\nconst isAdmin = session.user.role === \"admin\";\nif (!isOwner && !isAdmin) notFound();",
    check: "소유권 검사 줄을 잠깐 주석 처리하면 남의 주문이 보이는지 확인한 뒤, 반드시 원상복구",
    before: "// 로그인만 되어 있으면 누구의 주문이든 조회된다\nconst order = await getOrder(params.id);\nreturn <OrderDetail order={order} />;",
    vuln: true,
  },
  {
    project: "class",
    no: "13",
    status: "done",
    tag: "rate-limit",
    title: "로그인 시도 횟수 제한 (Rate Limiting)",
    learned:
      "무차별 대입 공격을 막으려고 이메일별로 1분에 5번까지만 허용했습니다. 비싼 작업(DB 조회, bcrypt)을 하기 전에 먼저 검사해야 서버 자원을 아낄 수 있습니다. 메모리에 저장하는 방식이라 서버가 여러 대면 Redis 같은 공유 저장소가 필요합니다.",
    file: "rateLimit.ts",
    code: "const WINDOW_MS = 60_000;   // 1분\nconst MAX_ATTEMPTS = 5;\n// signIn() 호출 전에 먼저 검사한다\nconst limit = checkLoginRateLimit(email);\nif (!limit.allowed) redirect(\"/login?error=ratelimited\");",
    check: "틀린 비밀번호로 6번 시도하면 6번째에 '로그인 시도가 너무 많습니다'가 뜨는지 확인",
    before: "// 로그인 시도 횟수에 제한이 없다\nawait signIn(\"credentials\", { email, password });\n// 비밀번호를 무한히 대입해 볼 수 있다",
    vuln: true,
  },
  {
    project: "class",
    no: "14",
    status: "done",
    tag: "headers",
    title: "보안 헤더로 브라우저 차원의 방어 추가",
    learned:
      "코드에 버그가 없어도 iframe 삽입(클릭재킹)이나 MIME 스니핑 같은 브라우저의 기본 동작이 공격 표면이 됩니다. next.config.ts로 모든 응답에 헤더를 붙였습니다.",
    file: "next.config.ts",
    code: "// 모든 응답에 보안 헤더를 붙인다\n{ key: \"X-Content-Type-Options\", value: \"nosniff\" },\n{ key: \"X-Frame-Options\", value: \"DENY\" },\n{ key: \"Referrer-Policy\", value: \"strict-origin-when-cross-origin\" },",
    check: "curl -I http://localhost:3000/ 으로 응답 헤더 확인",
    before: "// 보안 헤더 설정이 없다\n// 다른 사이트가 우리 페이지를 iframe에 넣을 수 있고\n// 브라우저가 파일 형식을 제멋대로 해석할 수 있다",
    vuln: false,
  },
];

export const metadata = pageMeta(
  "학습 로그",
  "수업과 프로젝트에서 배운 웹 보안 내용과 이 사이트의 보안 점검 리포트입니다.",
);

export default function LogPage() {
  return (
    <main>
      <section className="section" aria-labelledby="log-title">
        <Reveal className="wrap">
          <h1 className="section-title" id="log-title">
            <span className="section-no" aria-hidden="true">
              $ git log
            </span>
            learning.log
          </h1>
          <p className="log-intro">
            개인 포트폴리오와 수업 프로젝트에서 배운 보안 내용을 나눠서 남깁니다.
            코드는 수업 자료와 제 프로젝트의 코드를 줄이거나 단순화한 예시입니다.
          </p>
          <LogExplorer logs={logs} />
          <p className="log-more">
            <span aria-hidden="true">$ </span>다음 기록은 배우는 대로 추가됩니다
            <span className="log-cursor" aria-hidden="true" />
          </p>
          <p>
            <Link href="/">← 메인으로 돌아가기</Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
