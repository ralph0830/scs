import Link from 'next/link'
import { Button } from '@/components/ui/button'

const adminMenus = [
  { key: 'monsters', label: '몬스터 관리', icon: '👹', desc: '던전에서 등장하는 몬스터들을 관리합니다', href: '/admin/monsters' },
  { key: 'dungeons', label: '던전 관리', icon: '🏰', desc: '게임 내 던전들을 관리합니다', href: '/admin/dungeons' },
  { key: 'types', label: '타입 상성 관리', icon: '⚔️', desc: '크리터 타입 간의 상성 관계를 관리합니다', href: '/admin/types' },
  { key: 'critters', label: '크리터 관리', icon: '🐾', desc: '게임 내 크리터들을 관리합니다', href: '/admin/critters', border: true },
  { key: 'items', label: '아이템 관리', icon: '🎒', desc: '게임 내 아이템들을 관리합니다', href: '/admin/items' },
]

export default function AdminDashboardPage() {
  return (
    <div className="bg-[#222] text-gray-100 min-h-0 h-auto overflow-y-hidden">
      <main className="px-2 py-4 bg-[#222] min-h-screen">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {adminMenus.map(menu => (
            <Link href={menu.href} key={menu.key}>
              <div className={`flex items-center gap-4 bg-[#333] border ${menu.border ? 'border-blue-500' : 'border-[#444]'} rounded-xl px-4 py-3 shadow hover:bg-[#444] transition group cursor-pointer`}>
                <span className="text-3xl">{menu.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-base font-semibold">{menu.label}</div>
                  <div className="text-xs mt-1 text-gray-400">{menu.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center mb-8">
          <Link href="/api/auth/admin-logout">
            <Button variant="outline">관리자 로그아웃</Button>
          </Link>
        </div>
      </main>
    </div>
  )
} 