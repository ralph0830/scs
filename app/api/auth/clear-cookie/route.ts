import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: '쿠키가 삭제되었습니다.' },
      { status: 200 }
    )

    // JWT 토큰 쿠키 제거
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 즉시 만료
    })

    return response
  } catch (error) {
    console.error('Clear cookie error:', error)
    return NextResponse.json(
      { message: '쿠키 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 