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
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json(
        { message: '아이디와 비밀번호가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!userId.trim() || !password.trim()) {
      return NextResponse.json(
        { message: '아이디와 비밀번호는 공백일 수 없습니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 길이 검증 (최소 4자)
    if (password.length < 4) {
      return NextResponse.json(
        { message: '비밀번호는 최소 4자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 아이디 중복 확인
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, userId))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: '이미 존재하는 아이디입니다.' },
        { status: 409 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await db.insert(users).values({
      id: newUserId,
      username: userId,
      password: hashedPassword,
      gold: 1000,
      diamonds: 100,
    })

    const response = NextResponse.json(
      { message: '회원가입이 완료되었습니다.' },
      { status: 201 }
    )

    return response
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 