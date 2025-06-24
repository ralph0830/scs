import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { monsters } from '../db/schema';
import monsterData from './monster_seed.json';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function seedMonsters() {
  console.log('몬스터 시드 데이터 삽입 시작...');
  
  try {
    // 기존 몬스터 데이터 삭제
    await db.delete(monsters);
    console.log('기존 몬스터 데이터 삭제 완료');
    
    // dungeonId 필드를 제거하고 몬스터 데이터 준비
    const monsterDataWithoutDungeonId = monsterData.map((monster: any) => ({
      name: monster.name,
      description: monster.description,
      emoji: monster.emoji,
      imageUrl: monster.imageUrl,
      type: monster.type as 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon' | 'steel' | 'dark' | 'fairy',
      baseHp: monster.baseHp,
      baseAttack: monster.baseAttack,
      baseDefense: monster.baseDefense,
      hpGrowth: monster.hpGrowth,
      attackGrowth: monster.attackGrowth,
      defenseGrowth: monster.defenseGrowth,
      rarity: monster.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
      minLevel: monster.minLevel,
      maxLevel: monster.maxLevel,
      experienceReward: monster.experienceReward,
      goldReward: monster.goldReward,
      dropRate: monster.dropRate
    }));
    
    // 새로운 몬스터 데이터 삽입
    await db.insert(monsters).values(monsterDataWithoutDungeonId);
    
    console.log(`몬스터 시드 데이터 삽입 완료: ${monsterDataWithoutDungeonId.length}개`);
    
    // 삽입된 데이터 확인
    const count = await db.select({ count: monsters.id }).from(monsters);
    console.log(`데이터베이스에 저장된 몬스터 수: ${count.length}개`);
    
  } catch (error) {
    console.error('몬스터 시드 데이터 삽입 실패:', error);
  }
  
  sqlite.close();
}

seedMonsters(); 