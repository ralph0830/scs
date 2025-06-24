import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { monsters } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { monsterId: string } }
) {
  try {
    const monsterId = parseInt(params.monsterId);
    const body = await request.json();
    const { name, description, emoji, imageUrl, type, baseHp, baseAttack, baseDefense, hpGrowth, attackGrowth, defenseGrowth, rarity, minLevel, maxLevel, experienceReward, goldReward, dropRate } = body;

    const updatedMonster = await db.update(monsters)
      .set({
        name,
        description,
        emoji,
        imageUrl,
        type,
        baseHp,
        baseAttack,
        baseDefense,
        hpGrowth,
        attackGrowth,
        defenseGrowth,
        rarity,
        minLevel,
        maxLevel,
        experienceReward,
        goldReward,
        dropRate,
      })
      .where(eq(monsters.id, monsterId))
      .returning();

    if (updatedMonster.length === 0) {
      return NextResponse.json({ error: 'Monster not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMonster[0]);
  } catch (error) {
    console.error('Error updating monster:', error);
    return NextResponse.json({ error: 'Failed to update monster' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { monsterId: string } }
) {
  try {
    const monsterId = parseInt(params.monsterId);
    
    const deletedMonster = await db.delete(monsters)
      .where(eq(monsters.id, monsterId))
      .returning();

    if (deletedMonster.length === 0) {
      return NextResponse.json({ error: 'Monster not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Monster deleted successfully' });
  } catch (error) {
    console.error('Error deleting monster:', error);
    return NextResponse.json({ error: 'Failed to delete monster' }, { status: 500 });
  }
} 