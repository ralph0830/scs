import { db } from '@/db'
import { dungeonAreas, userDungeonProgress, userCritters, critters } from '@/db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import DungeonClient from '@/components/dungeon/DungeonClient'
import { getAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { IDungeonWithDetails, ICritter } from '@/types'

function log(msg: string) {
  console.log(msg)
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write(msg + '\n')
  }
}

export default async function DungeonPage() {
  log('DungeonPage: Start');
  let auth;
  try {
    auth = await getAuth()
    log('DungeonPage: getAuth() success')
  } catch (e) {
    log('DungeonPage: getAuth() error: ' + (e as any)?.message)
    throw e
  }
  if (!auth) {
    log('DungeonPage: No auth, redirecting');
    redirect('/sign-in')
  }
  const userId = auth.userId
  log(`DungeonPage: Auth successful for userId: ${userId}`);

  // 1. Fetch all dungeon areas (limit 1 for debug)
  let areas = []
  try {
    areas = await db.select().from(dungeonAreas).orderBy(desc(dungeonAreas.id)).limit(1)
    log('DungeonPage: Fetched areas ' + areas.length)
  } catch (e) {
    log('DungeonPage: areas fetch error: ' + (e as any)?.message)
    throw e
  }
  
  // 2. Fetch user progress for all dungeons (limit 1 for debug)
  let progress = []
  try {
    progress = await db.select().from(userDungeonProgress).where(eq(userDungeonProgress.userId, String(userId))).limit(1)
    log('DungeonPage: Fetched progress ' + progress.length)
  } catch (e) {
    log('DungeonPage: progress fetch error: ' + (e as any)?.message)
    throw e
  }
  
  // 3. Combine area and progress data
  const dungeonsData: IDungeonWithDetails[] = areas.map(area => {
    const userProgress = progress.find(p => p.dungeonId === area.id)
    return {
      ...area,
      userProgress: userProgress
    }
  })
  log('DungeonPage: Combined dungeon data');

  // 4. Fetch user's critters (limit 1 for debug)
  let userCritterIds: number[] = []
  try {
    userCritterIds = (await db.select({ critterId: userCritters.critterId }).from(userCritters).where(eq(userCritters.userId, String(userId))).limit(1)).map(c => c.critterId);
    log('DungeonPage: Fetched user critter IDs ' + userCritterIds.length);
  } catch (e) {
    log('DungeonPage: userCritterIds fetch error: ' + (e as any)?.message)
    throw e
  }
     
  let userCrittersData: ICritter[] = [];
  if (userCritterIds.length > 0) {
    try {
      userCrittersData = await db.select().from(critters).where(inArray(critters.id, userCritterIds)).limit(1)
      log('DungeonPage: Fetched user critters data ' + userCrittersData.length);
    } catch (e) {
      log('DungeonPage: userCrittersData fetch error: ' + (e as any)?.message)
      throw e
    }
  } else {
    log('DungeonPage: No user critters');
  }
  
  return <DungeonClient initialDungeons={dungeonsData} initialCritters={userCrittersData} />
}
