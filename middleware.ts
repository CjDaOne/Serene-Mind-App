export { default } from "next-auth/middleware"

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
