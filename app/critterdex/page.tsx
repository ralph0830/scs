import { db } from '@/db'
import { userCritters, critters } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function CritterdexPage() {
  const auth = await getAuth()
  if (!auth) redirect('/sign-in')
  const { userId } = auth

  // 유저가 소유한 크리터 + 크리터 정보 join
  const userCritterList = await db
    .select({
      id: userCritters.id,
      level: userCritters.level,
      critter: critters,
    })
    .from(userCritters)
    .innerJoin(critters, eq(userCritters.critterId, critters.id))
    .where(eq(userCritters.userId, userId))
    .orderBy(asc(userCritters.id))

  return (
    <div className="bg-[#222] min-h-screen py-4 px-2">
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {userCritterList.length === 0 && (
          <div className="text-gray-400 text-center py-8">등록된 크리터가 없습니다.</div>
        )}
        {userCritterList.map(({ id, level, critter }) => (
          <div
            key={id}
            className="flex items-center gap-4 bg-[#333] border border-[#444] rounded-xl px-4 py-3 shadow"
          >
            {/* 크리터 이미지 */}
            <div className="w-12 h-12 relative flex-shrink-0">
              {critter.imageUrl ? (
                <Image
                  src={critter.imageUrl}
                  alt={critter.name}
                  fill
                  sizes="48px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              ) : (
                <span className="text-3xl flex items-center justify-center w-full h-full">🐾</span>
              )}
            </div>
            {/* 이름/레벨 */}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base text-gray-100">{critter.name}</div>
              <div className="text-xs text-gray-400">Lv.{level}</div>
            </div>
            {/* 장비 슬롯 */}
            <div className="flex gap-2">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className="w-12 h-12 bg-[#222] border border-[#555] rounded flex items-center justify-center"
                >
                  {/* 장비 아이콘이 있다면 <Image ... />로 표시 */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 