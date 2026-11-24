import { NextResponse } from "next/server";
import { dbName, getClient, hasMongoConfig } from "@/lib/mongodb";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT = 5; // IP당 허용 횟수
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10분

export async function POST(request: Request) {
  // 1) 같은 사이트에서 보낸 요청만 받습니다. (다른 사이트가 몰래 보내는 요청 차단)
  const origin = request.headers.get("origin");
  if (origin) {
    let sameSite = false;
    try {
      sameSite = new URL(origin).host === request.headers.get("host");
    } catch {
      sameSite = false;
    }
    if (!sameSite) {
      return NextResponse.json(
        { error: "허용되지 않은 요청입니다." },
        { status: 403 },
      );
    }
  }

  // 2) 요청 횟수 제한: 같은 IP에서 10분에 5번까지만 받습니다.
  const limit = checkRateLimit(
    `contact:${clientIp(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `문의를 너무 자주 보냈습니다. ${Math.ceil(limit.retryAfterSeconds / 60)}분 뒤에 다시 시도해 주세요.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  // 3) 본문이 너무 크면 읽기 전에 거절합니다.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "요청이 너무 큽니다." },
      { status: 413 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  // 봇이 채우는 숨김 필드. 값이 있으면 성공한 것처럼 응답하고 저장하지 않습니다.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 1 || name.length > 50) {
    return NextResponse.json(
      { error: "이름은 1~50자로 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 100) {
    return NextResponse.json(
      { error: "이메일 주소 형식을 확인해 주세요." },
      { status: 400 },
    );
  }
  if (message.length < 5 || message.length > 2000) {
    return NextResponse.json(
      { error: "메시지는 5~2000자로 입력해 주세요." },
      { status: 400 },
    );
  }

  if (!hasMongoConfig()) {
    return NextResponse.json(
      {
        error:
          "서버에 MongoDB가 연결되어 있지 않습니다. .env.local 을 설정해 주세요.",
      },
      { status: 503 },
    );
  }

  try {
    const client = await getClient();
    await client.db(dbName).collection("messages").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });
    await sendNotification({ name, email, message });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[contact] 저장 실패:", error);
    return NextResponse.json(
      { error: "메시지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}

async function sendNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return; // 설정이 없으면 메일은 건너뜁니다

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: data.email,
        // 메일 제목에 줄바꿈이 들어가 헤더를 오염시키지 못하게 정리합니다.
        subject: `[포트폴리오] ${data.name.replace(/[\r\n]+/g, " ")}님의 문의`,
        text: `이름: ${data.name}\n이메일: ${data.email}\n\n${data.message}`,
      }),
    });
    // fetch는 4xx·5xx 응답에서도 에러를 던지지 않으므로 상태 코드를 직접 확인합니다.
    // (메시지는 이미 DB에 저장됐으니 방문자에게는 성공으로 응답하고, 서버 로그에만 남깁니다.)
    if (!response.ok) {
      console.error(
        `[contact] 메일 알림 실패: Resend ${response.status}`,
        await response.text().catch(() => ""),
      );
    }
  } catch (error) {
    console.error("[contact] 메일 알림 실패:", error);
  }
}
