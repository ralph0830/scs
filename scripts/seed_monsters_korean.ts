import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { monsters } from '../db/schema';
import monsterData from './monster_seed_korean.json';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function seedKoreanMonsters() {
  console.log('한글화된 몬스터 시드 데이터 삽입 시작...');
  
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
    
    console.log(`한글화된 몬스터 시드 데이터 삽입 완료: ${monsterDataWithoutDungeonId.length}개`);
    
    // 삽입된 데이터 확인
    const count = await db.select({ count: monsters.id }).from(monsters);
    console.log(`데이터베이스에 저장된 몬스터 수: ${count.length}개`);
    
    // 통계 출력
    const typeStats: Record<string, number> = {};
    const rarityStats: Record<string, number> = {};
    
    monsterDataWithoutDungeonId.forEach((monster: any) => {
      typeStats[monster.type] = (typeStats[monster.type] || 0) + 1;
      rarityStats[monster.rarity] = (rarityStats[monster.rarity] || 0) + 1;
    });
    
    console.log('\n타입별 분포:');
    Object.entries(typeStats).forEach(([type, count]) => {
      const typeLabels: Record<string, string> = {
        normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', 
        fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', 
        bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', 
        dark: '악', fairy: '페어리'
      };
      console.log(`${typeLabels[type] || type}: ${count}개`);
    });
    
    console.log('\n희귀도별 분포:');
    Object.entries(rarityStats).forEach(([rarity, count]) => {
      const rarityLabels: Record<string, string> = {
        common: '일반', uncommon: '고급', rare: '희귀', epic: '에픽', legendary: '전설'
      };
      console.log(`${rarityLabels[rarity] || rarity}: ${count}개`);
    });
    
  } catch (error) {
    console.error('한글화된 몬스터 시드 데이터 삽입 실패:', error);
  }
  
  sqlite.close();
}

seedKoreanMonsters(); 