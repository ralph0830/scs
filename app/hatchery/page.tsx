import { db } from '@/db'
import { userCritters, critters } from '@/db/schema'
import { eq, and, count, asc } from 'drizzle-orm'
import HatcheryClient from '@/components/hatchery/HatcheryClient'
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HatcheryPage() {
  const auth = await getAuth()
  if (!auth) {
    redirect('/sign-in')
  }
  const userId = auth.userId

  const userEggs = await db
    .select({
      id: critters.id,
      name: critters.name,
      description: critters.description,
      imageUrl: critters.imageUrl,
      count: count(userCritters.id),
    })
    .from(userCritters)
    .innerJoin(critters, eq(userCritters.critterId, critters.id))
    .where(and(eq(userCritters.userId, userId), eq(critters.name, 'Egg')))
    .groupBy(critters.id, critters.name, critters.description, critters.imageUrl)
    .orderBy(asc(critters.id))

  return <HatcheryClient initialEggs={userEggs} />
} 