import { db } from '@/db'
import { typeMatchups } from '@/db/schema'
import TypeMatchupManager from '@/components/admin/TypeMatchupManager'
import { ITypeMatchup } from '@/types'

export default async function TypeMatchupPage() {
  const allMatchupsData = await db.select().from(typeMatchups)

  const initialMatchups: ITypeMatchup[] = allMatchupsData.map(m => ({
    attackingType: m.attackingType,
    defendingType: m.defendingType,
    effectiveness: m.multiplier
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          타입 상성 관리
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          크리터 타입 간의 상성 관계를 관리합니다
        </p>
      </div>

      <TypeMatchupManager initialData={initialMatchups} />

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          타입 상성은 공격 타입이 방어 타입에 얼마나 효과적인지를 나타냅니다.
        </p>
      </div>
    </div>
  )
} 