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
    <div className="bg-[#222] text-gray-100 min-h-screen">
      <main className="px-2 py-4 bg-[#222] min-h-screen">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          <div className="bg-[#333] border border-[#444] rounded-xl p-4 shadow mb-4">
            <h1 className="text-2xl font-bold mb-2">타입 상성 관리</h1>
            <TypeMatchupManager initialData={initialMatchups} darkMode />
          </div>
        </div>
      </main>
    </div>
  )
} 