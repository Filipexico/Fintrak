import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rotas do dashboard e admin
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    // Verificar se existe cookie de sessão do NextAuth
    // NextAuth v5 usa diferentes nomes de cookie dependendo da configuração
    const sessionToken = 
      request.cookies.get("authjs.session-token")?.value || 
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      // Redirecionar para login se não autenticado
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}
