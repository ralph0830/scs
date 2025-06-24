import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { dungeonAreas } from '../db/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function checkDungeons() {
  try {
    const areas = await db.select().from(dungeonAreas);
    console.log('던전 영역 수:', areas.length);
    
    areas.forEach(area => {
      console.log(`ID: ${area.id}, 이름: ${area.name}`);
    });
    
  } catch (error) {
    console.error('던전 데이터 확인 실패:', error);
  }
  
  sqlite.close();
}

checkDungeons(); 