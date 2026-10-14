"use client";

import { useState, type FormEvent } from "react";

type Status = { state: "idle" | "sending" | "success" | "error"; text: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle", text: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ state: "sending", text: "보내는 중입니다." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({
          state: "error",
          text: result.error ?? "메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.",
        });
        return;
      }

      form.reset();
      setStatus({ state: "success", text: "메시지를 보냈습니다. 확인 후 답장드리겠습니다." });
    } catch {
      setStatus({
        state: "error",
        text: "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
      });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">이름</label>
        <input id="name" name="name" type="text" autoComplete="name" required maxLength={50} />
      </div>
      <div className="field">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={100}
        />
      </div>
      <div className="field">
        <label htmlFor="message">메시지</label>
        <textarea id="message" name="message" required minLength={5} maxLength={2000} />
      </div>

      {/* 봇 차단용 숨김 필드 */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">웹사이트</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="button" type="submit" disabled={status.state === "sending"}>
        메시지 보내기
      </button>
      <p className="form-status" data-state={status.state} role="status" aria-live="polite">
        {status.text}
      </p>
    </form>
  );
}
