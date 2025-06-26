import { db } from '@/db'
import { critters as crittersSchema } from '@/db/schema'
import CritterManager from '@/components/admin/CritterManager'

export default async function AdminCrittersPage() {
  const critters = await db.select().from(crittersSchema).orderBy(crittersSchema.id)

  return (
    <div className="bg-[#222] text-gray-100 min-h-screen">
      <main className="px-2 py-4 bg-[#222] min-h-screen">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          <div className="bg-[#333] border border-[#444] rounded-xl p-4 shadow mb-4">
            <h1 className="text-2xl font-bold mb-2">크리터 관리</h1>
            <CritterManager initialCritters={critters} darkMode />
          </div>
        </div>
      </main>
    </div>
  )
} 