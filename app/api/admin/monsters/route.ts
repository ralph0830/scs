import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { monsters } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allMonsters = await db.select().from(monsters).orderBy(monsters.id);
    return NextResponse.json(allMonsters);
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return NextResponse.json({ error: 'Failed to fetch monsters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, imageUrl, type, baseHp, baseAttack, baseDefense, rarity, experienceReward, goldReward } = body;

    const newMonster = await db.insert(monsters).values({
      id,
      name,
      description,
      imageUrl,
      type,
      baseHp,
      baseAttack,
      baseDefense,
      rarity,
      experienceReward,
      goldReward,
    }).returning();

    return NextResponse.json(newMonster[0]);
  } catch (error) {
    console.error('Error creating monster:', error);
    return NextResponse.json({ error: 'Failed to create monster' }, { status: 500 });
  }
} 