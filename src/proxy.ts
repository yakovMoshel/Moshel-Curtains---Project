import { NextResponse, type NextRequest } from "next/server";

const WWW_HOST = "www.moshelhavilonot.co.il";
const APEX_HOST = "moshelhavilonot.co.il";

/**
 * Redirects www -> apex so Google treats the two hosts as one canonical
 * site instead of duplicate content (both currently resolve — see
 * DEPLOYMENT.md section 5 — with no redirect between them until now).
 */
export function proxy(request: NextRequest): NextResponse {
  if (request.headers.get("host") === WWW_HOST) {
    const url = new URL(request.url);
    url.hostname = APEX_HOST;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
