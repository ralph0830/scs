import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { dungeonAreas } from '../db/schema';

// 1. JSON 파일 읽기
const raw = JSON.parse(readFileSync('raw_data/dungeons_raw.json', 'utf-8'));

// 2. DB 연결
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

// 3. 던전 데이터 마이그레이션
for (const d of raw) {
  db.insert(dungeonAreas).values({
    // id는 auto increment이므로 입력하지 않음
    name: d.name,
    // 나머지 필드는 기본값/빈 값
    description: '',
    minLevel: 1,
    maxLevel: 100,
    difficulty: 'easy',
    unlockRequirement: '',
    backgroundImage: '',
  }).run();
}

console.log('던전 마이그레이션 완료!');
