import { db } from '@/db'
import { monsterSpawns } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { dungeonId: number } },
) {
  try {
    const spawns = await db.query.monsterSpawns.findMany({
      where: eq(monsterSpawns.areaId, params.dungeonId),
      with: {
        monster: true,
      },
    })
    return NextResponse.json(spawns)
  } catch (error) {
    console.error('Error fetching monster spawns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monster spawns' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { dungeonId: number } },
) {
  try {
    const body = await request.json()
    const { monsterId, spawnRate, minLevel, maxLevel, isBoss } = body

    if (!monsterId || !spawnRate || !minLevel || !maxLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newSpawn = await db
      .insert(monsterSpawns)
      .values({
        areaId: params.dungeonId,
        monsterId,
        spawnRate,
        minLevel,
        maxLevel,
        isBoss: isBoss || false,
      })
      .returning()

    return NextResponse.json(newSpawn[0], { status: 201 })
  } catch (error) {
    console.error('Error creating monster spawn:', error)
    return NextResponse.json(
      { error: 'Failed to create monster spawn' },
      { status: 500 },
    )
  }
} 