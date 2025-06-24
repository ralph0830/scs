import { Button } from '@/components/ui/button'

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          상점
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          특별한 아이템과 크리터를 구매하세요
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 아이템 카드 예시 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-lg font-semibold mb-2">희귀 크리터 알</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              희귀한 크리터가 나올 확률이 높은 알입니다
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">1,000 골드</span>
              <Button size="sm">구매</Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">경험치 부스터</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              크리터의 경험치 획득량을 2배로 증가시킵니다
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">500 골드</span>
              <Button size="sm">구매</Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold mb-2">방어 아이템</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              던전 탐험 시 크리터의 방어력을 증가시킵니다
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">300 골드</span>
              <Button size="sm">구매</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            현재 보유 골드
          </h2>
          <div className="text-4xl font-bold text-yellow-600 mb-4">
            1,234 💰
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            던전 탐험을 통해 더 많은 골드를 획득하세요
          </p>
        </div>
      </div>
    </div>
  )
} 