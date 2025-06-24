import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const itemId = parseInt(params.itemId)
    const body = await request.json()
    const { name, description, type, buyPrice, sellPrice, imageUrl } = body

    const updatedItem = await db
      .update(items)
      .set({
        name,
        description,
        type,
        buyPrice,
        sellPrice,
        imageUrl,
      })
      .where(eq(items.id, itemId))
      .returning()

    if (updatedItem.length === 0) {
      return NextResponse.json(
        { error: '아이템을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error('아이템 수정 오류:', error)
    return NextResponse.json(
      { error: '아이템 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const itemId = parseInt(params.itemId)

    const deletedItem = await db
      .delete(items)
      .where(eq(items.id, itemId))
      .returning()

    if (deletedItem.length === 0) {
      return NextResponse.json(
        { error: '아이템을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '아이템이 삭제되었습니다.' })
  } catch (error) {
    console.error('아이템 삭제 오류:', error)
    return NextResponse.json(
      { error: '아이템 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
} 