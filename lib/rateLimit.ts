// 요청 횟수 제한 (고정 윈도우 방식)
// 서버 프로세스 하나의 메모리에만 저장합니다. 서버가 여러 대이거나 재시작되면
// 카운터가 초기화되므로, 실무에서는 Redis 같은 공유 저장소를 함께 씁니다.

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  // 오래된 항목을 정리해서 메모리가 계속 늘어나지 않게 합니다.
  if (buckets.size > 1000) {
    buckets.forEach((entry, k) => {
      if (entry.resetAt <= now) buckets.delete(k);
    });
  }

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

// 배포 환경(Vercel)이 붙여 주는 x-forwarded-for의 첫 번째 값을 사용합니다.
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
