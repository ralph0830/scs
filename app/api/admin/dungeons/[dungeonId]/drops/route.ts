import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { dungeonItemDrops, items } from '@/db/schema'
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

export async function GET(
  req: Request,
  { params }: { params: { dungeonId: string } },
) {
  const dungeonId = parseInt(params.dungeonId, 10)
  if (isNaN(dungeonId)) {
    return new Response('Invalid dungeon ID', { status: 400 })
  }

  try {
    const drops = await db
      .select({
        id: dungeonItemDrops.id,
        areaId: dungeonItemDrops.areaId,
        itemId: dungeonItemDrops.itemId,
        itemName: items.name,
        dropRate: dungeonItemDrops.dropRate,
      })
      .from(dungeonItemDrops)
      .innerJoin(items, eq(dungeonItemDrops.itemId, items.id))
      .where(eq(dungeonItemDrops.areaId, dungeonId))
      .orderBy(dungeonItemDrops.dropRate)

    return Response.json(drops)
  } catch (error) {
    console.error('Error fetching dungeon item drops:', error)
    return new Response('Error fetching dungeon item drops', { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { dungeonId: string } },
) {
  const dungeonId = parseInt(params.dungeonId, 10)
  if (isNaN(dungeonId)) {
    return new Response('Invalid dungeon ID', { status: 400 })
  }

  const body = await req.json()
  const { itemId, dropRate } = body

  if (!itemId || dropRate === undefined) {
    return new Response('Missing required fields', { status: 400 })
  }

  try {
    const newDrop = await db
      .insert(dungeonItemDrops)
      .values({
        areaId: dungeonId,
        itemId,
        dropRate,
      })
      .returning()

    return Response.json(newDrop[0])
  } catch (error) {
    console.error('Error creating dungeon item drop:', error)
    return new Response('Error creating dungeon item drop', { status: 500 })
  }
} 