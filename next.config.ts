import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images 설정을 추가합니다.
  images: {
    // remotePatterns를 사용하여 허용할 외부 이미지 URL 패턴을 정의합니다.
    remotePatterns: [
      {
        protocol: "https", // 프로토콜 (http 또는 https)
        hostname: "flexible.img.hani.co.kr", // 한겨레 썸네일
      },
      {
        protocol: "https",
        hostname: "ojsfile.ohmynews.com", // 오마이뉴스 썸네일
      },
      {
        protocol: "https",
        hostname: "www.chosun.com", // 조선일보 썸네일
      },
      {
        protocol: "https",
        hostname: "dimg.donga.com", // 동아일보 썸네일
      },
      {
        protocol: "https",
        hostname: "image.donga.com",
      },
      {
        protocol: "https",
        hostname: "img.khan.co.kr", // 경향신문 썸네일
      },
      {
        protocol: "https",
        hostname: "www.google.com", // 구글 파비콘 서비스
      },
      {
        protocol: "https",
        hostname: "media.livere.org", // 라이브리 파비콘 서비스 (오마이뉴스 예시)
      },
      {
        protocol: "https",
        hostname: "www.syu.ac.kr", // 삼육대학교 썸네일
      },
      {
        protocol: "https",
        hostname: "ojsimg.ohmynews.com", // 오마이뉴스 이미지
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 구글 유저 컨텐츠
      },
      {
        protocol: "https",
        hostname: "dimg1.donga.com", // 동아일보 썸네일 (추가)
      },
      {
        protocol: "https",
        hostname: "img.megazonesoft.com",
      },
      // 다른 뉴스 매체의 이미지 도메인이 있다면 여기에 추가합니다.
      // 예: { protocol: 'https', hostname: 'img.example-news.com' }
    ],
  },
  /* 기존 다른 config 옵션들 */
};

export default nextConfig;
