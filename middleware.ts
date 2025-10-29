import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next()
    
    response.headers.set('X-Request-ID', crypto.randomUUID())
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/journal/:path*',
    '/calendar/:path*',
    '/rewards/:path*',
    '/affirmations/:path*'
  ]
}
