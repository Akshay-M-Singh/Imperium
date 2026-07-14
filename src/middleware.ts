import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Locale routing (Architecture §8): English is canonical at "/" (internally
// rewritten to /en); Arabic is visible at /ar. Explicit /en URLs redirect
// to the bare path so each page has exactly one public URL per locale.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files, and anything with a
  // file extension (fonts, images, videos).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
