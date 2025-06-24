'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function SignUpPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId.trim()) {
      toast({
        title: 'ID 입력 필요',
        description: 'ID를 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    if (!password.trim()) {
      toast({
        title: '비밀번호 입력 필요',
        description: '비밀번호를 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: '비밀번호 불일치',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: '비밀번호 길이 부족',
        description: '비밀번호는 최소 6자 이상이어야 합니다.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
      })

      if (response.ok) {
        toast({
          title: '회원가입 성공',
          description: '회원가입이 완료되었습니다. 로그인해주세요.',
        })
        router.push('/sign-in')
      } else {
        const error = await response.json()
        toast({
          title: '회원가입 실패',
          description: error.message || '회원가입 중 오류가 발생했습니다.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '회원가입 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/sign-in"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              로그인
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">아이디</Label>
              <Input
                id="userId"
                name="userId"
                type="text"
                autoComplete="username"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요 (최소 6자)"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 