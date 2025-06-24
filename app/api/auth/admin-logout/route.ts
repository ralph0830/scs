import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-auth-token')

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  response.cookies.delete('admin-auth-token')

  return response
} 