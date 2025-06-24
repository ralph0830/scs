'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import LogoutButton from './logout-button';

export default function Header() {
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
    <header className="header-fixed bg-white dark:bg-gray-800 shadow-md w-full p-4 flex items-center justify-between z-40">
      <div className="text-lg font-bold text-gray-800 dark:text-white">
        <Link href="/">별빛 크리터 이야기</Link>
      </div>
      
      <nav className="hidden md:flex space-x-6">
        <Link href="/critterdex" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          크리터덱스
        </Link>
        <Link href="/dungeon" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          던전
        </Link>
        <Link href="/hatchery" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          부화장
        </Link>
        <Link href="/shop" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          상점
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for resources */}
        <div className="flex items-center gap-2">
          <span role="img" aria-label="gold">
            💰
          </span>
          <span>1,234</span>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
} 