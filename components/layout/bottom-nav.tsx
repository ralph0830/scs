'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '홈', icon: '🏠' },
    { href: '/critterdex', label: '내 크리터', icon: '📖' },
    { href: '/dungeon', label: '던전', icon: '⚔️' },
    { href: '/hatchery', label: '부화장', icon: '🥚' },
    { href: '/shop', label: '상점', icon: '🛒' },
  ];

  return (
    <nav className="bottom-nav-fixed fixed bottom-0 left-0 right-0 h-16 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
      <div className="flex justify-around h-full items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 px-3 text-xs h-full min-h-0 ${
              pathname === item.href
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 