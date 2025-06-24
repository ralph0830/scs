import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-jwt-secret-key-for-development-only'
)

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/api/auth/sign-in', '/api/auth/sign-up']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth-token')?.value

  // Check if the route is public
  if (PUBLIC_ROUTES.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // For protected routes, check for a valid token
  if (!authToken) {
    // Redirect to sign-in page if no token
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  try {
    // Verify the JWT token
    await jwtVerify(authToken, JWT_SECRET)
    // Token is valid, continue to the requested page
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, redirect to sign-in page
    console.error('JWT Verification Error:', error)
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    // Clear the invalid token cookie
    const response = NextResponse.redirect(url)
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico).*)'],
}
