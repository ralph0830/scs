import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { dungeonAreas, userDungeonProgress } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuth()
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { userId } = auth

    // 사용자가 로그인한 경우, 해금된 던전 목록을 반환
    const userProgress = await db.query.userDungeonProgress.findMany({
      where: and(
        eq(userDungeonProgress.userId, String(userId)),
        eq(userDungeonProgress.isUnlocked, true),
      ),
      with: {
        dungeon: true,
      },
    })

    const unlockedDungeons = userProgress.map((p) => p.dungeon)
    return NextResponse.json(unlockedDungeons)
  } catch (error) {
    console.error('Failed to fetch available dungeons:', error)
    return NextResponse.json(
      { error: '던전 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
} 