import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { dungeonAreas } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const dungeonSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert', 'master']),
  minLevel: z.number().int().min(1),
  maxLevel: z.number().int().min(1),
  unlockRequirement: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
}).refine((data) => data.minLevel <= data.maxLevel, {
  message: "최소 레벨은 최대 레벨보다 작거나 같아야 합니다.",
  path: ["minLevel"],
});

export async function GET(
  request: NextRequest,
  { params }: { params: { dungeonId: string } }
) {
  try {
    const dungeonId = parseInt(params.dungeonId, 10)
    const dungeon = await db
      .select()
      .from(dungeonAreas)
      .where(eq(dungeonAreas.id, dungeonId))
    
    if (dungeon.length === 0) {
      return NextResponse.json({ error: 'Dungeon not found' }, { status: 404 })
    }
    
    return NextResponse.json(dungeon[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dungeon' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { dungeonId: string } }
) {
  try {
    const dungeonId = parseInt(params.dungeonId, 10)
    const body = await request.json()
    const validatedData = dungeonSchema.parse(body)

    const updatedDungeon = await db
      .update(dungeonAreas)
      .set(validatedData)
      .where(eq(dungeonAreas.id, dungeonId))
      .returning()

    if (updatedDungeon.length === 0) {
      return NextResponse.json({ error: 'Dungeon not found' }, { status: 404 })
    }

    return NextResponse.json(updatedDungeon[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update dungeon' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { dungeonId: string } }
) {
  try {
    const dungeonId = parseInt(params.dungeonId, 10)

    const deletedDungeon = await db
      .delete(dungeonAreas)
      .where(eq(dungeonAreas.id, dungeonId))
      .returning()

    if (deletedDungeon.length === 0) {
      return NextResponse.json({ error: 'Dungeon not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Dungeon deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete dungeon' }, { status: 500 })
  }
} 