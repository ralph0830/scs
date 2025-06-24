import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-jwt-secret-key-for-development-only'
)

export async function GET(request: NextRequest) {
  try {
    const testUsername = 'testuser'
    
    // Find the test user
    const userResult = await db.select().from(users).where(eq(users.username, testUsername)).limit(1)

    if (userResult.length === 0) {
      return NextResponse.json({ message: 'Test user not found' }, { status: 404 })
    }
    const userData = userResult[0]

    // Create JWT
    const token = await new SignJWT({
      userId: userData.id,
      username: userData.username,
      isAdmin: userData.isAdmin ?? false,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h') // Shorter expiration for dev login
      .sign(JWT_SECRET)

    // Redirect to home and set cookie
    const url = request.nextUrl.clone()
    url.pathname = '/'
    const response = NextResponse.redirect(url)

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    })

    return response
  } catch (error) {
    console.error('Dev login error:', error)
    return NextResponse.json({ message: 'An error occurred during dev login.' }, { status: 500 })
  }
} 