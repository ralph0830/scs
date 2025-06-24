import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { items } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allItems = await db.select().from(items)
    return NextResponse.json(allItems)
  } catch (error) {
    console.error('아이템 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '아이템 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type, buyPrice, sellPrice, imageUrl } = body

    const newItem = await db.insert(items).values({
      name,
      description,
      type,
      buyPrice,
      sellPrice,
      imageUrl,
    }).returning()

    return NextResponse.json(newItem[0])
  } catch (error) {
    console.error('아이템 추가 오류:', error)
    return NextResponse.json(
      { error: '아이템 추가에 실패했습니다.' },
      { status: 500 }
    )
  }
} 