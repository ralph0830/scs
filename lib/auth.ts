import { cookies } from 'next/headers'
import { jwtVerify, type JWTPayload } from 'jose'

// JWT_SECRET이 없을 때 기본값 제공
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-jwt-secret-key-for-development-only'
)

interface AuthPayload extends JWTPayload {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

export async function getAuth() {
  const token = cookies().get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify<AuthPayload>(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error('JWT Verification in getAuth failed:', error)
    return null
  }
} 