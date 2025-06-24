import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { dungeonItemDrops } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const dropSchema = z.object({
  dungeonId: z.number().int().min(1),
  itemId: z.number().int().min(1),
  dropRate: z.number().min(0.001).max(1),
  minDistance: z.number().int().min(0),
  maxDistance: z.number().int().min(0).optional(),
}).refine((data) => !data.maxDistance || data.minDistance <= data.maxDistance, {
  message: "최소 거리는 최대 거리보다 작거나 같아야 합니다.",
  path: ["minDistance"],
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dungeonId: string; dropId: string }> }
) {
  try {
    const { dungeonId: dungeonIdStr, dropId: dropIdStr } = await params
    const dungeonId = parseInt(dungeonIdStr)
    const dropId = parseInt(dropIdStr)
    
    if (isNaN(dungeonId) || isNaN(dropId)) {
      return NextResponse.json(
        { error: '유효하지 않은 ID입니다.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = dropSchema.parse(body)

    // 던전 ID가 URL과 일치하는지 확인
    if (validatedData.dungeonId !== dungeonId) {
      return NextResponse.json(
        { error: '던전 ID가 일치하지 않습니다.' },
        { status: 400 }
      )
    }

    const updatedDrop = await db
      .update(dungeonItemDrops)
      .set(validatedData)
      .where(eq(dungeonItemDrops.id, dropId))
      .returning()

    if (updatedDrop.length === 0) {
      return NextResponse.json(
        { error: '아이템 드롭을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedDrop[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update item drop:', error)
    return NextResponse.json(
      { error: '아이템 드롭 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dungeonId: string; dropId: string }> }
) {
  try {
    const { dropId: dropIdStr } = await params
    const dropId = parseInt(dropIdStr)
    if (isNaN(dropId)) {
      return NextResponse.json(
        { error: '유효하지 않은 드롭 ID입니다.' },
        { status: 400 }
      )
    }

    const deletedDrop = await db
      .delete(dungeonItemDrops)
      .where(eq(dungeonItemDrops.id, dropId))
      .returning()

    if (deletedDrop.length === 0) {
      return NextResponse.json(
        { error: '아이템 드롭을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '아이템 드롭이 삭제되었습니다.' })
  } catch (error) {
    console.error('Failed to delete item drop:', error)
    return NextResponse.json(
      { error: '아이템 드롭 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
} 