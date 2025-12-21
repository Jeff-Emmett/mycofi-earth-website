import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Handle zine.mycofi.earth subdomain
  if (host.startsWith('zine.')) {
    // Don't rewrite if already accessing /zine paths or API/static files
    if (
      pathname.startsWith('/zine') ||
      pathname.startsWith('/api/zine') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Rewrite root and other paths to /zine
    const url = request.nextUrl.clone()

    if (pathname === '/') {
      url.pathname = '/zine'
    } else if (pathname.startsWith('/create')) {
      url.pathname = `/zine${pathname}`
    } else if (pathname.startsWith('/z/')) {
      url.pathname = `/zine${pathname}`
    } else {
      // For any other path, try prepending /zine
      url.pathname = `/zine${pathname}`
    }

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
