import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pt", "en"];
const defaultLocale = "pt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return;
  if (pathname === "/diagnostico" || pathname === "/diagnostico/") {
    const url = request.nextUrl.clone();
    url.pathname = "/pt/diagnostico";
    return NextResponse.redirect(url);
  }
  if (pathname === "/recursos" || pathname === "/recursos/") {
    const url = request.nextUrl.clone();
    url.pathname = "/pt/recursos";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/recursos/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/pt${pathname}`;
    return NextResponse.redirect(url);
  }

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
