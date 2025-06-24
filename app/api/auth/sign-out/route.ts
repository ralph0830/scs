import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: '로그아웃 성공' },
      { status: 200 }
    )

    // JWT 토큰 쿠키 제거
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // 사이트 전체에서 쿠키 삭제
      maxAge: 0, // 즉시 만료
    })

    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { message: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 