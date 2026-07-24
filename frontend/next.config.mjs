/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Wildcard subdomain — matches any Supabase project's Storage host,
        // since the project ref (NEXT_PUBLIC_SUPABASE_URL) differs per deployment.
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      {
        // avatarUrl can also come from GitHub profile import (backend/src/app.ts
        // ghData.avatarUrl), which next/image also needs allowlisted.
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        // Deny framing on all non-embed routes to mitigate clickjacking
        source: "/((?!embed).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for Next.js inline chunks
              "style-src 'self' 'unsafe-inline'",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""} ${process.env.NEXT_PUBLIC_HORIZON_URL ?? ""} ${process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? ""}`,
              "img-src 'self' data: blob: https:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      {
        // Allow cross-origin embedding of the embed widget pages
        source: "/embed/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
};

export default nextConfig;
