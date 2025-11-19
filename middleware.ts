import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // No i18n routing needed anymore
  return NextResponse.next()
}

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
