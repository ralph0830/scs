import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-jwt-secret-key-for-development-only'
)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: '아이디와 비밀번호가 필요합니다.' },
        { status: 400 }
      )
    }

    // 사용자 조회
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    const userData = user[0]

    // 비밀번호 해시 검증
    const isValid = await bcrypt.compare(password, userData.password)
    if (!isValid) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // JWT 토큰 생성
    const token = await new SignJWT({ 
      userId: userData.id, 
      username: userData.username,
      isAdmin: userData.isAdmin ?? false,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const response = NextResponse.json(
      { 
        message: '로그인 성공',
        user: {
          id: userData.id,
          username: userData.username,
          isAdmin: userData.isAdmin ?? false,
        }
      },
      { status: 200 }
    )

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7일
    })

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { message: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 