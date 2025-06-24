'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast({
        title: '사용자명 입력 필요',
        description: '사용자명을 입력해주세요.',
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

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        toast({
          title: '로그인 성공',
          description: '관리자 로그인이 완료되었습니다.',
        })
        router.push('/admin')
        router.refresh() // 페이지 새로고침 추가
      } else {
        const error = await response.json()
        toast({
          title: '로그인 실패',
          description: error.message || '관리자 로그인 중 오류가 발생했습니다.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '관리자 로그인 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">아이디</Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="관리자 아이디를 입력하세요"
          />
        </div>
        <div>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="관리자 비밀번호를 입력하세요"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </div>
    </form>
  )
} 