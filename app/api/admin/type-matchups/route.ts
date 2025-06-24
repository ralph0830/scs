import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { typeMatchups, critterTypes } from '@/db/schema'
import { sql } from 'drizzle-orm'

type TypeName = typeof critterTypes[number];

export async function GET() {
  try {
    const allMatchups = await db.select().from(typeMatchups);
    return NextResponse.json(allMatchups);
  } catch (error) {
    console.error('Failed to fetch type matchups:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { matchups } = await request.json();

    if (!matchups || Object.keys(matchups).length === 0) {
      return NextResponse.json({ message: 'No matchups data provided' }, { status: 400 });
    }

    const caseClauses = Object.keys(matchups).map(key => {
      const [attackingType, defendingType] = key.split('-') as [TypeName, TypeName];
      const multiplier = matchups[key];
      // sql 헬퍼는 자동으로 파라미터를 바인딩해줌
      return sql`WHEN attacking_type = ${attackingType} AND defending_type = ${defendingType} THEN ${multiplier}`;
    });

    const finalQuery = sql`
      UPDATE type_matchups
      SET multiplier = CASE ${sql.join(caseClauses, sql.raw(' '))}
      ELSE multiplier
      END
    `;
    
    // @ts-ignore : drizzle-orm/better-sqlite3에서 run은 SQL을 직접 실행할 수 있음
    await db.run(finalQuery);

    return NextResponse.json({ message: 'Matchups updated successfully' });
  } catch (error) {
    console.error('Failed to update type matchups:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 