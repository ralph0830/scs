import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CritterManager from '@/components/admin/CritterManager'
import { db } from '@/db'
import { critters as crittersSchema } from '@/db/schema'

export default async function AdminDashboardPage() {
  const allCritters = await db.select().from(crittersSchema).orderBy(crittersSchema.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          관리자 대시보드
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          게임 데이터를 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/monsters">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">👹</div>
            <h3 className="text-lg font-semibold mb-2">몬스터 관리</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              던전에서 등장하는 몬스터들을 관리합니다
            </p>
          </div>
        </Link>

        <Link href="/admin/dungeons">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">🏰</div>
            <h3 className="text-lg font-semibold mb-2">던전 관리</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              게임 내 던전들을 관리합니다
            </p>
          </div>
        </Link>

        <Link href="/admin/types">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-lg font-semibold mb-2">타입 상성 관리</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              크리터 타입 간의 상성 관계를 관리합니다
            </p>
          </div>
        </Link>
        
        <Link href="/admin/critters">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-blue-500">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-lg font-semibold mb-2">크리터 관리</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                게임 내 크리터들을 관리합니다
              </p>
          </div>
        </Link>

        <Link href="/admin/items">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">🎒</div>
            <h3 className="text-lg font-semibold mb-2">아이템 관리</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              게임 내 아이템들을 관리합니다
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-8 text-center mb-8">
        <Link href="/api/auth/admin-logout">
          <Button variant="outline">
            관리자 로그아웃
          </Button>
        </Link>
      </div>
    </div>
  )
} 