import { db } from '@/db'
import { userCritters, critters } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import CritterCard from '@/components/CritterCard'
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CritterList from '@/components/CritterList'

export default async function CritterdexPage() {
  const auth = await getAuth()

  if (!auth) {
    redirect('/sign-in')
  }

  const { userId } = auth

  const userCritterList = await db
    .select({
      level: userCritters.level,
    })
    .from(userCritters)
    .innerJoin(critters, eq(userCritters.critterId, critters.id))
    .where(eq(userCritters.userId, userId))
    .orderBy(asc(critters.id))

  const allCritters = await db.select().from(critters).orderBy(asc(critters.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          크리터덱스
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          수집한 모든 크리터들을 확인하세요
        </p>
      </div>
      
      <CritterList initialCritters={allCritters} />
    </div>
  );
} 