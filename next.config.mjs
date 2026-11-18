/** @type {import('next').NextConfig} */
const securityHeaders = [
  // 브라우저가 파일 형식을 제멋대로 추측하지 못하게 합니다.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 다른 사이트가 이 페이지를 iframe에 넣는 것(클릭재킹)을 막습니다.
  { key: "X-Frame-Options", value: "DENY" },
  // 다른 사이트로 이동할 때 넘어가는 주소 정보를 줄입니다.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 카메라·마이크·위치 정보는 쓰지 않는다고 선언합니다.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
