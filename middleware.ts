import { SESSION_COOKIE } from '@/lib/session'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/auth/callback', '/watch']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  const session = request.cookies.get(SESSION_COOKIE)?.value

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/scenarios', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
