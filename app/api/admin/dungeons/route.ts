import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { dungeonAreas } from '@/db/schema'
import { z } from 'zod'

const dungeonSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert', 'master']),
  minLevel: z.number().int().min(1),
  maxLevel: z.number().int().min(1),
  unlockRequirement: z.string().optional(),
  backgroundImage: z.string().optional(),
}).refine((data) => data.minLevel <= data.maxLevel, {
  message: "최소 레벨은 최대 레벨보다 작거나 같아야 합니다.",
  path: ["minLevel"],
});

export async function GET() {
  try {
    const allDungeons = await db.select().from(dungeonAreas)
    return NextResponse.json(allDungeons)
  } catch (error) {
    console.error('Failed to fetch dungeons:', error)
    return NextResponse.json(
      { error: '던전 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = dungeonSchema.parse(body)

    const newDungeon = await db.insert(dungeonAreas).values({
      ...validatedData,
    }).returning()

    return NextResponse.json(newDungeon[0], { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create dungeon:', error)
    return NextResponse.json(
      { error: '던전 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
} 