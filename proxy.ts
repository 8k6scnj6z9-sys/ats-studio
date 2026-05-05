import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pt", "en"];
const defaultLocale = "pt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept.toLowerCase().startsWith("en")
    ? "en"
    : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|studio|logos|.*\\..*).*)"],
};
