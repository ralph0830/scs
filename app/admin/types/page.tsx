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
    <TypeMatchupManager initialData={initialMatchups} darkMode />
  )
} 