import { NextResponse } from "next/server";
import { dbName, getClient, hasMongoConfig } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
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
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: data.email,
        subject: `[포트폴리오] ${data.name}님의 문의`,
        text: `이름: ${data.name}\n이메일: ${data.email}\n\n${data.message}`,
      }),
    });
  } catch (error) {
    console.error("[contact] 메일 알림 실패:", error);
  }
}
