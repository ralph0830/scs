import { NextResponse } from 'next/server'
import { db } from '@/db';
import { critters } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const ALL_CRITTER_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying',
  'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
] as const;

type CritterType = typeof ALL_CRITTER_TYPES[number];

export async function GET(
  req: Request,
  { params: rawParams }: { params: { critterId: string } }
) {
  try {
    const params = await Promise.resolve(rawParams);
    const critterId = parseInt(params.critterId, 10);
    if (isNaN(critterId)) {
      return new NextResponse('Critter ID must be a number', { status: 400 });
    }

    const critter = await db.select().from(critters).where(eq(critters.id, critterId));

    if (critter.length === 0) {
      return new NextResponse('Critter not found', { status: 404 });
    }

    return NextResponse.json(critter[0]);
  } catch (error) {
    console.error('[CRITTER_DETAIL_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const putCritterSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    type: z.enum(ALL_CRITTER_TYPES).optional(),
    imageUrl: z.string().optional(),
    baseHp: z.number().optional(),
    baseAttack: z.number().optional(),
    baseDefense: z.number().optional(),
    hpGrowth: z.number().optional(),
    attackGrowth: z.number().optional(),
    defenseGrowth: z.number().optional(),
})

export async function PUT(
    request: Request,
    { params: rawParams }: { params: { critterId: string } }
) {
    try {
        const params = await Promise.resolve(rawParams);
        const critterId = parseInt(params.critterId, 10);
        if (isNaN(critterId)) {
            return new NextResponse('Critter ID must be a number', { status: 400 });
        }

        const body = await request.json();
        const updatedData = putCritterSchema.parse(body);

        if (Object.keys(updatedData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const [updatedCritter] = await db.update(critters)
            .set(updatedData)
            .where(eq(critters.id, critterId))
            .returning();

        if (!updatedCritter) {
            return NextResponse.json({ error: 'Critter not found' }, { status: 404 });
        }

        return NextResponse.json(updatedCritter);

    } catch(error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Failed to update critter:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params: rawParams }: { params: { critterId: string } }
) {
    try {
        const params = await Promise.resolve(rawParams);
        const critterId = parseInt(params.critterId, 10);
        if (isNaN(critterId)) {
            return new NextResponse('Critter ID must be a number', { status: 400 });
        }

        const [deletedCritter] = await db.delete(critters)
            .where(eq(critters.id, critterId))
            .returning();

        if (!deletedCritter) {
            return NextResponse.json({ error: 'Critter not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Critter deleted successfully' });
    } catch (error) {
        console.error('Failed to delete critter:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 