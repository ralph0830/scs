'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: '로그아웃 성공',
          description: '안전하게 로그아웃되었습니다.',
        });
        
        // 페이지를 강제로 새로고침하여 모든 상태를 초기화
        window.location.href = '/sign-in';
      } else {
        toast({
          title: '로그아웃 실패',
          description: '로그아웃 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '로그아웃 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
    >
      로그아웃
    </Button>
  );
} 