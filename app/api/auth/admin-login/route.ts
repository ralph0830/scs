import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-jwt-secret-key-for-development-only')

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1)

    if (userResult.length === 0) {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const user = userResult[0]

    if (!user.isAdmin) {
      return NextResponse.json({ message: '관리자 계정이 아닙니다.' }, { status: 403 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const token = await new SignJWT({ admin: true, userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    const response = NextResponse.json({ message: '관리자 로그인 성공' }, { status: 200 })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    })
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
} 