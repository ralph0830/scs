import { db } from '@/db'
import { critters as crittersSchema } from '@/db/schema'
import CritterManager from '@/components/admin/CritterManager'

export default async function AdminCrittersPage() {
  const critters = await db.select().from(crittersSchema).orderBy(crittersSchema.id)

  return <CritterManager initialCritters={critters} />
} 