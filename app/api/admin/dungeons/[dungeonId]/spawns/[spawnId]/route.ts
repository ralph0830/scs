import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { monsterSpawns } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const spawnSchema = z.object({
  dungeonId: z.number().int().min(1),
  monsterId: z.number().int().min(1),
  spawnRate: z.number().min(0.01).max(1),
  minLevel: z.number().int().min(1),
  maxLevel: z.number().int().min(1),
  isBoss: z.boolean(),
  bossSpawnCondition: z.string().optional(),
}).refine((data) => data.minLevel <= data.maxLevel, {
  message: "최소 레벨은 최대 레벨보다 작거나 같아야 합니다.",
  path: ["minLevel"],
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dungeonId: string; spawnId: string }> }
) {
  try {
    const { dungeonId: dungeonIdStr, spawnId: spawnIdStr } = await params
    const dungeonId = parseInt(dungeonIdStr)
    const spawnId = parseInt(spawnIdStr)
    
    if (isNaN(dungeonId) || isNaN(spawnId)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID입니다.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = spawnSchema.parse(body)

    // 던전 ID가 URL과 일치하는지 확인
    if (validatedData.dungeonId !== dungeonId) {
      return NextResponse.json(
        { error: '던전 ID가 일치하지 않습니다.' },
        { status: 400 }
      )
    }

    const updatedSpawn = await db
      .update(monsterSpawns)
      .set(validatedData)
      .where(eq(monsterSpawns.id, spawnId))
      .returning()

    if (updatedSpawn.length === 0) {
      return NextResponse.json(
        { error: '몬스터 스폰을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedSpawn[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update monster spawn:', error)
    return NextResponse.json(
      { error: '몬스터 스폰 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dungeonId: string; spawnId: string }> }
) {
  try {
    const { spawnId: spawnIdStr } = await params
    const spawnId = parseInt(spawnIdStr)
    if (isNaN(spawnId)) {
      return NextResponse.json(
        { error: '유효하지 않은 스폰 ID입니다.' },
        { status: 400 }
      )
    }

    const deletedSpawn = await db
      .delete(monsterSpawns)
      .where(eq(monsterSpawns.id, spawnId))
      .returning()

    if (deletedSpawn.length === 0) {
      return NextResponse.json(
        { error: '몬스터 스폰을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '몬스터 스폰이 삭제되었습니다.' })
  } catch (error) {
    console.error('Failed to delete monster spawn:', error)
    return NextResponse.json(
      { error: '몬스터 스폰 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
} 