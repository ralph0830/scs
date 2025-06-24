import { NextResponse } from 'next/server';
import { db } from '@/db';
import { critters } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { ICritter } from '@/types';

const ALL_CRITTER_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying',
  'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
] as const;

type CritterType = typeof ALL_CRITTER_TYPES[number];

export async function GET() {
  try {
    const allCritters = await db.select().from(critters);
    return NextResponse.json(allCritters);
  } catch (error) {
    console.error('[CRITTERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const postCritterSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    type: z.enum(ALL_CRITTER_TYPES),
    imageUrl: z.string().optional(),
    baseHp: z.number().optional(),
    baseAttack: z.number().optional(),
    baseDefense: z.number().optional(),
    hpGrowth: z.number().optional(),
    attackGrowth: z.number().optional(),
    defenseGrowth: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCritterData = postCritterSchema.parse(body);

    const [newCritter] = await db.insert(critters).values(newCritterData).returning();

    return NextResponse.json(newCritter, { status: 201 });
  } catch(error) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Failed to create critter:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
} 