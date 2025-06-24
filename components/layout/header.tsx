'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);

  // 로그아웃 핸들러 (기존 logout-button.tsx 로직 이식)
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
      });
      if (response.ok) {
        // 페이지를 강제로 새로고침하여 모든 상태를 초기화
        window.location.href = '/sign-in';
      } else {
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* 상단바 */}
      <header className="header-fixed bg-white dark:bg-gray-800 shadow-md w-full p-4 flex items-center justify-between z-40">
        {/* 햄버거 버튼 */}
        <button
          className="p-2 mr-2 focus:outline-none"
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu className="w-7 h-7 text-gray-800 dark:text-gray-200" />
        </button>
        {/* 타이틀 */}
        <div className="flex-1 text-center text-lg font-bold text-gray-800 dark:text-white select-none">
          별빛 크리터 이야기
        </div>
        {/* 골드만 표시 */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white/80 dark:bg-gray-700/80">
            <span className="text-yellow-400 text-lg">💰</span>
            <span className="font-bold text-gray-800 dark:text-gray-100">1,234</span>
          </div>
        </div>
      </header>

      {/* 슬라이드 메뉴(왼쪽에서 등장) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'visible' : 'invisible pointer-events-none'}`}
        style={{ background: open ? 'rgba(0,0,0,0.3)' : 'transparent' }}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 font-bold text-lg border-b border-gray-200 dark:border-gray-700">메뉴</div>
          <nav className="flex flex-col p-4 gap-3 flex-1">
            <Link href="/" className="hover:text-blue-600" onClick={() => setOpen(false)}>홈</Link>
            <Link href="/critterdex" className="hover:text-blue-600" onClick={() => setOpen(false)}>크리터덱스</Link>
            <Link href="/dungeon" className="hover:text-blue-600" onClick={() => setOpen(false)}>던전</Link>
            <Link href="/hatchery" className="hover:text-blue-600" onClick={() => setOpen(false)}>부화장</Link>
            <Link href="/shop" className="hover:text-blue-600" onClick={() => setOpen(false)}>상점</Link>
          </nav>
          {/* 로그아웃 메뉴 */}
          <button
            className="w-full flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" /> 로그아웃
          </button>
        </aside>
      </div>
    </>
  );
} 