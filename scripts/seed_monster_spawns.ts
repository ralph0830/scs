import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { monsters, dungeonAreas, monsterSpawns } from '../db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

// 던전 정보 (기존 던전 데이터와 매칭)
const dungeonMapping = [
  { id: 1, name: 'D1. 마법의 숲' },
  { id: 2, name: 'D2. 사막' },
  { id: 3, name: 'D3. 영원한 전장' },
  { id: 4, name: 'D4. 황금 도시' },
  { id: 5, name: 'D5. 블랙워터 항구' },
  { id: 6, name: 'D6. 얼어붙는 봉우리' },
  { id: 7, name: 'D7. 흑요석 광산' },
  { id: 8, name: 'D8. 남부 숲' },
  { id: 9, name: 'D9. 메마른 황무지' },
  { id: 10, name: 'D10. 숨겨진 도시, 라록스' },
  { id: 11, name: 'D11. 잊혀진 대지' },
  { id: 12, name: 'R1. 슬라임 연못' },
  { id: 13, name: 'R2. [E]신성한 고고학' },
  { id: 14, name: 'R3. 고대 무덤 발굴' },
  { id: 15, name: 'R4. [E]제국 구조' },
  { id: 16, name: 'R5. 광신도의 반란' },
  { id: 17, name: 'R6. [E]끔찍한 상승' },
  { id: 18, name: 'R7. 실종된 탐험대' },
  { id: 19, name: 'R8. [E]천상의 모선' },
  { id: 20, name: 'R9. [E]무서운 하강' }
];

async function seedMonsterSpawns() {
  console.log('몬스터 스폰 데이터 삽입 시작...');
  
  try {
    // 기존 몬스터 스폰 데이터 삭제
    await db.delete(monsterSpawns);
    console.log('기존 몬스터 스폰 데이터 삭제 완료');
    
    // 모든 몬스터와 던전 영역 가져오기
    const allMonsters = await db.select().from(monsters);
    const allDungeonAreas = await db.select().from(dungeonAreas);
    
    console.log(`총 ${allMonsters.length}개 몬스터 발견`);
    console.log(`총 ${allDungeonAreas.length}개 던전 영역 발견`);
    
    // 테스트용: 모든 몬스터를 첫 번째 던전에 스폰
    const spawnData = [];
    
    for (const monster of allMonsters) {
      // 첫 번째 던전 (D1. 마법의 숲)에 모든 몬스터 스폰
      const firstDungeon = allDungeonAreas.find(d => d.id === 1);
      
      if (firstDungeon) {
        spawnData.push({
          areaId: firstDungeon.id,
          monsterId: monster.id,
          spawnRate: 0.15, // 15% 기본 스폰률
          minLevel: monster.minLevel || 1,
          maxLevel: monster.maxLevel || 100,
          isBoss: false // 기본적으로 일반 몬스터
        });
        
        console.log(`스폰 설정: ${monster.name} -> ${firstDungeon.name} (ID: ${firstDungeon.id})`);
      }
    }
    
    // 스폰 데이터 삽입
    if (spawnData.length > 0) {
      await db.insert(monsterSpawns).values(spawnData);
      console.log(`몬스터 스폰 데이터 삽입 완료: ${spawnData.length}개`);
    } else {
      console.log('삽입할 스폰 데이터가 없습니다.');
    }
    
    // 삽입된 데이터 확인
    const count = await db.select({ count: monsterSpawns.id }).from(monsterSpawns);
    console.log(`데이터베이스에 저장된 몬스터 스폰 수: ${count.length}개`);
    
  } catch (error) {
    console.error('몬스터 스폰 데이터 삽입 실패:', error);
  }
  
  sqlite.close();
}

seedMonsterSpawns(); 