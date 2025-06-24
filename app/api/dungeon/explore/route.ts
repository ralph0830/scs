import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { monsters, monsterSpawns, dungeonAreas, items, userDungeonProgress, users } from "@/db/schema";
import { eq, and, like } from "drizzle-orm";
import { getAuth } from '@/lib/auth';

// Simplified Interfaces
interface IPartyCritter {
    id: number;
    baseHp: number;
    baseAttack: number;
    baseDefense: number;
    name: string;
}

interface IExplorationRequest {
  party: IPartyCritter[];
  areaId: number;
  currentDistance: number;
  totalDistance: number;
  status: 'exploring' | 'in_combat';
  combat?: IDungeonCombat;
}

interface IExplorationResponse {
  status: 'exploring' | 'in_combat' | 'completed' | 'failed';
  distance: number;
  event?: IDungeonEvent;
  combat?: IDungeonCombat;
  rewards?: {
    gold: number;
    items: any[];
    experience: number;
  };
  logs: string[];
}

interface IDungeonEvent {
  type: 'monster' | 'item' | 'rest';
  description: string;
}

interface IDungeonCombat {
  monsters: any[];
  currentMonsterIndex: number;
  partyHp: number[];
  monsterHp: number[];
  turn: number;
  isPlayerTurn: boolean;
}

// Helper Functions
async function getRandomMonsters(areaId: number): Promise<any[]> {
    const validSpawns = await db.query.monsterSpawns.findMany({
        where: eq(monsterSpawns.areaId, areaId)
    });

    if (validSpawns.length === 0) return [];

    const monsterCount = Math.floor(Math.random() * 2) + 1;
    const selectedMonsters = [];

    for (let i = 0; i < monsterCount; i++) {
        const randomSpawn = validSpawns[Math.floor(Math.random() * validSpawns.length)];
        if (Math.random() < randomSpawn.spawnRate) {
            const monster = await db.query.monsters.findFirst({
                where: eq(monsters.id, randomSpawn.monsterId),
            });
            if (monster) {
                selectedMonsters.push(monster);
            }
        }
    }
    return selectedMonsters;
}

function processCombatTurn(combat: IDungeonCombat, party: IPartyCritter[]): { combat: IDungeonCombat; logs: string[] } {
    const logs: string[] = [];
    const currentMonster = combat.monsters[combat.currentMonsterIndex];

    if (combat.isPlayerTurn) {
        party.forEach((critter, idx) => {
            if (combat.partyHp[idx] > 0) {
                const damage = Math.max(1, critter.baseAttack - currentMonster.baseDefense);
                combat.monsterHp[combat.currentMonsterIndex] -= damage;
                logs.push(`${critter.name}이(가) ${currentMonster.name}에게 ${damage}의 피해를 입혔습니다!`);
            }
        });

        if (combat.monsterHp[combat.currentMonsterIndex] <= 0) {
            logs.push(`${currentMonster.name}을(를) 물리쳤습니다!`);
            combat.currentMonsterIndex++;
        }
    } else {
        party.forEach((_, idx) => {
            if (combat.partyHp[idx] > 0) {
                const damage = Math.max(1, currentMonster.baseAttack - party[idx].baseDefense);
                combat.partyHp[idx] -= damage;
                logs.push(`${currentMonster.name}이(가) ${party[idx].name}에게 ${damage}의 피해를 입혔습니다!`);
                if (combat.partyHp[idx] <= 0) {
                    logs.push(`${party[idx].name}이(가) 쓰러졌습니다!`);
                }
            }
        });
    }

    combat.turn++;
    combat.isPlayerTurn = !combat.isPlayerTurn;
    return { combat, logs };
}

// Main API Route
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth();
    if (!auth) {
      return NextResponse.json({ message: '사용자 인증이 필요합니다.' }, { status: 401 });
    }
    const userId = auth.userId;

    const body: IExplorationRequest = await req.json();
    const { party, areaId, currentDistance, totalDistance, status } = body;
    let { combat } = body;

    const logs: string[] = [];
    let newStatus: 'exploring' | 'in_combat' | 'completed' | 'failed' = status;
    let newDistance = currentDistance;
    let event: IDungeonEvent | undefined;
    let rewards = { gold: 0, items: [] as any[], experience: 0 };

    if (newStatus === 'in_combat' && combat) {
        const combatResult = processCombatTurn(combat, party);
        combat = combatResult.combat;
        logs.push(...combatResult.logs);

        if (combat.currentMonsterIndex >= combat.monsters.length) {
            newStatus = 'exploring';
            const totalExp = combat.monsters.reduce((sum, m) => sum + (m.experienceReward || 0), 0);
            const totalGold = combat.monsters.reduce((sum, m) => sum + (m.goldReward || 0), 0);
            rewards.experience += totalExp;
            rewards.gold += totalGold;
            logs.push(`전투 승리! 경험치 ${totalExp}, 골드 ${totalGold} 획득!`);
            combat = undefined;
        } else if (combat.partyHp.every(hp => hp <= 0)) {
            newStatus = 'failed';
            logs.push('파티가 전멸했습니다...');
        }
    } else {
        newDistance += 10;
        if (newDistance >= totalDistance) {
            newStatus = 'completed';
            logs.push('던전을 완주했습니다! 축하합니다!');
        } else {
            const monsterEventChance = 0.4;
            if (Math.random() < monsterEventChance) {
                const foundMonsters = await getRandomMonsters(areaId);
                if (foundMonsters.length > 0) {
                    newStatus = 'in_combat';
                    event = { type: 'monster', description: `${foundMonsters.map(m => m.name).join(', ')}가 나타났다!` };
                    logs.push(event.description);
                    combat = {
                        monsters: foundMonsters,
                        currentMonsterIndex: 0,
                        partyHp: party.map(p => p.baseHp * 10), // Simplified HP
                        monsterHp: foundMonsters.map(m => m.baseHp),
                        turn: 1,
                        isPlayerTurn: true,
                    };
                }
            } else {
                 event = { type: 'rest', description: '계속 탐험합니다...' };
                 logs.push(event.description);
            }
        }
    }

    if (newStatus === 'completed' || newStatus === 'failed') {
      const isCleared = newStatus === 'completed';

      const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
      if (currentUser) {
        await db.update(users).set({ gold: currentUser.gold + rewards.gold }).where(eq(users.id, userId));
      }

      const progress = await db.query.userDungeonProgress.findFirst({
        where: and(eq(userDungeonProgress.userId, userId), eq(userDungeonProgress.dungeonId, areaId)),
      });

      if (progress) {
        await db.update(userDungeonProgress).set({
          maxDistance: Math.max(progress.maxDistance, newDistance),
          totalGoldEarned: progress.totalGoldEarned + rewards.gold,
          totalExperienceEarned: progress.totalExperienceEarned + rewards.experience,
          clearCount: progress.clearCount + (isCleared ? 1 : 0),
        }).where(and(eq(userDungeonProgress.userId, userId), eq(userDungeonProgress.dungeonId, areaId)));
      } else {
        await db.insert(userDungeonProgress).values({
          userId,
          dungeonId: areaId,
          maxDistance: newDistance,
          totalGoldEarned: rewards.gold,
          totalExperienceEarned: rewards.experience,
          clearCount: isCleared ? 1 : 0,
          isUnlocked: true,
        });
      }

      if (isCleared) {
        const currentDungeon = await db.query.dungeonAreas.findFirst({ where: eq(dungeonAreas.id, areaId) });
        if (currentDungeon && currentDungeon.name.startsWith('D')) {
            const currentNum = parseInt(currentDungeon.name.substring(1).split('.')[0], 10);
            const nextDungeonPattern = `D${currentNum + 1}.%`;
            
            const nextDungeon = await db.query.dungeonAreas.findFirst({
                where: like(dungeonAreas.name, nextDungeonPattern),
            });
            
            if(nextDungeon) {
                const nextProgress = await db.query.userDungeonProgress.findFirst({
                    where: and(eq(userDungeonProgress.userId, userId), eq(userDungeonProgress.dungeonId, nextDungeon.id))
                });
                if (!nextProgress) {
                    await db.insert(userDungeonProgress).values({
                        userId,
                        dungeonId: nextDungeon.id,
                        isUnlocked: true,
                        clearCount: 0, maxDistance: 0, totalGoldEarned: 0, totalExperienceEarned: 0
                    });
                    logs.push(`새로운 던전 [${nextDungeon.name}]이(가) 해금되었습니다!`);
                }
            }
        }
      }
    }

    const response: IExplorationResponse = {
      status: newStatus,
      distance: newDistance,
      event,
      combat,
      rewards,
      logs,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dungeon exploration error:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
} 