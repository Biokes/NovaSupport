import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Built here (at request time) rather than in next.config.mjs's headers(),
// since process.env there is only resolved at build time and would bake in
// an empty connect-src on hosts where these vars are injected at runtime.
export function middleware(request: NextRequest) {
  // Per-request nonce so server-rendered inline scripts (e.g. the JSON-LD
  // structured-data block on profile pages) can be allow-listed individually
  // under the strict `script-src 'self'` policy below.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""} ${process.env.NEXT_PUBLIC_HORIZON_URL ?? ""} ${process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? ""}`,
    "img-src 'self' data: blob: https:",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-csp-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Excludes /embed/*, which keeps its own permissive frame-ancestors CSP
  // set in next.config.mjs, plus static assets.
  matcher: "/((?!embed|_next/static|_next/image|favicon.ico).*)",
};
