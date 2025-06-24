import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { db } from '@/db'
import { users, critters, userCritters } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

const HATCH_COST_GOLD = 100

export async function POST(request: Request) {
  try {
    const auth = await getAuth()

    if (!auth) {
      return new Response(JSON.stringify({ message: '인증되지 않은 사용자입니다.' }), { status: 401 })
    }

    const { userId } = auth

    // 1. Get user data
    const userResult = await db.select().from(users).where(eq(users.id, userId))
    if (userResult.length === 0) {
      // This case might happen if the webhook for user creation hasn't processed yet.
      // For testing, we might want to insert a temporary user.
      // However, the webhook should handle this in production.
      // Let's assume the user exists for this test.
      // If no user, it's a valid reason to fail.
      return new NextResponse(`User with ID ${userId} not found in our DB. Webhook might be delayed or failed.`, {
        status: 404
      })
    }
    
    // 2. Check if user has enough gold
    const user = userResult[0]
    if (user.gold < HATCH_COST_GOLD) {
      return NextResponse.json({ error: 'Not enough gold.' }, { status: 400 })
    }

    // 3. Get a random critter from the base `critters` table
    // Note: This assumes the `critters` table has been seeded with data.
    const randomCritterResult = await db.select().from(critters).orderBy(sql`RANDOM()`).limit(1);
    const baseCritter = randomCritterResult[0]

    if (!baseCritter) {
        return NextResponse.json({ error: 'No critters available to hatch.' }, { status: 500 })
    }

    // 4. Deduct gold and create the new critter instance for the user
    // We can wrap this in a transaction in a real app to ensure atomicity
    await db.update(users)
      .set({ gold: user.gold - HATCH_COST_GOLD })
      .where(eq(users.id, userId))
      
    const [newCritterInstance] = await db.insert(userCritters).values({
      userId: userId,
      critterId: baseCritter.id,
      level: 1,
      hp: baseCritter.baseHp,
      attack: baseCritter.baseAttack,
      defense: baseCritter.baseDefense,
    }).returning();


    return NextResponse.json(newCritterInstance)

  } catch (error) {
    console.error('[HATCHERY_POST]', error)
    return new NextResponse('Internal ServerError', { status: 500 })
  }
} 