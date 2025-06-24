import 'dotenv/config'
import { db } from '../db'
import { dungeonAreas } from '../db/schema'
import { writeFileSync } from 'fs'
import path from 'path'
import { drizzle } from 'drizzle-orm/d1'
import { sql } from 'drizzle-orm'
import { 
  dungeons, 
  dungeonMonsterSpawns, 
  dungeonItemDrops,
  monsters,
  items
} from '../db/schema'

// 던전 정보
const dungeons = [
  { id: 1, name: 'D1. 마법의 숲', value: '1' },
  { id: 2, name: 'D2. 사막', value: '2' },
  { id: 3, name: 'D3. 영원한 전장', value: '3' },
  { id: 4, name: 'D4. 황금 도시', value: '4' },
  { id: 5, name: 'D5. 블랙워터 항구', value: '5' },
  { id: 6, name: 'D6. 얼어붙는 봉우리', value: '6' },
  { id: 7, name: 'D7. 흑요석 광산', value: '7' },
  { id: 8, name: 'D8. 남부 숲', value: '8' },
  { id: 9, name: 'D9. 메마른 황무지', value: '9' },
  { id: 10, name: 'D10. 숨겨진 도시, 라록스', value: '16' },
  { id: 11, name: 'D11. 잊혀진 대지', value: '18' },
  { id: 12, name: 'R1. 슬라임 연못', value: '10' },
  { id: 13, name: 'R2. [E]신성한 고고학', value: '11' },
  { id: 14, name: 'R3. 고대 무덤 발굴', value: '12' },
  { id: 15, name: 'R4. [E]제국 구조', value: '13' },
  { id: 16, name: 'R5. 광신도의 반란', value: '14' },
  { id: 17, name: 'R6. [E]끔찍한 상승', value: '15' },
  { id: 18, name: 'R7. 실종된 탐험대', value: '17' },
  { id: 19, name: 'R8. [E]천상의 모선', value: '19' },
  { id: 20, name: 'R9. [E]무서운 하강', value: '20' }
];

// D1. 마법의 숲 몬스터들
const D1_MONSTERS = [
  '늑대', '멧돼지', '트렌트', '켄타우로스', '엔트', '황금 토끼', '숲의 정령'
]

// D2. 사막 몬스터들
const D2_MONSTERS = [
  '웜', '모래 독수리', '샤후리 전사', '샤후리 궁수', '샤후리 마법사', '진', '모래 석상'
]

// D3. 얼음 동굴 몬스터들
const D3_MONSTERS = [
  '얼음 거인', '서리 늑대', '얼음 정령', '서리 거미', '얼음 골렘', '서리 드래곤'
]

// D4. 지하 도시 몬스터들
const D4_MONSTERS = [
  '고블린', '오크', '트롤', '다크 엘프', '언데드', '다크 나이트', '다크 마법사'
]

// D5. 천상의 궁전 몬스터들
const D5_MONSTERS = [
  '천사', '성기사', '천상의 기사', '신성한 기사', '천상의 마법사', '신성한 마법사', '천상의 드래곤'
]

// 던전 정의
const DUNGEON_DATA = [
  {
    name: 'D1. 마법의 숲',
    description: '신비로운 마법이 깃든 숲. 초보자에게 적합한 던전입니다.',
    difficulty: 'easy' as const,
    totalDistance: 1000,
    minLevel: 1,
    maxLevel: 20,
    baseGoldReward: 100,
    baseExperienceReward: 50,
    unlockRequirement: null, // 첫 번째 던전은 바로 해금
    isUnlocked: true,
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'D2. 사막의 유적',
    description: '고대 문명의 유적이 숨겨진 사막. D1을 100회 클리어하면 해금됩니다.',
    difficulty: 'medium' as const,
    totalDistance: 1500,
    minLevel: 10,
    maxLevel: 40,
    baseGoldReward: 200,
    baseExperienceReward: 100,
    unlockRequirement: JSON.stringify({ dungeonId: 1, clearCount: 100 }),
    isUnlocked: false,
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'D3. 얼음 동굴',
    description: '영원한 얼음이 얼어붙은 동굴. D2를 150회 클리어하면 해금됩니다.',
    difficulty: 'hard' as const,
    totalDistance: 2000,
    minLevel: 20,
    maxLevel: 60,
    baseGoldReward: 350,
    baseExperienceReward: 175,
    unlockRequirement: JSON.stringify({ dungeonId: 2, clearCount: 150 }),
    isUnlocked: false,
    displayOrder: 3,
    isActive: true
  },
  {
    name: 'D4. 지하 도시',
    description: '고대 문명이 건설한 지하 도시. D3을 200회 클리어하면 해금됩니다.',
    difficulty: 'expert' as const,
    totalDistance: 2500,
    minLevel: 30,
    maxLevel: 80,
    baseGoldReward: 500,
    baseExperienceReward: 250,
    unlockRequirement: JSON.stringify({ dungeonId: 3, clearCount: 200 }),
    isUnlocked: false,
    displayOrder: 4,
    isActive: true
  },
  {
    name: 'D5. 천상의 궁전',
    description: '신들이 거주하는 천상의 궁전. D4를 300회 클리어하면 해금됩니다.',
    difficulty: 'master' as const,
    totalDistance: 3000,
    minLevel: 50,
    maxLevel: 100,
    baseGoldReward: 1000,
    baseExperienceReward: 500,
    unlockRequirement: JSON.stringify({ dungeonId: 4, clearCount: 300 }),
    isUnlocked: false,
    displayOrder: 5,
    isActive: true
  }
]

const defaultDungeons = [
  {
    name: 'D1. 마법의 숲',
    description: '신비로운 마법이 깃든 숲. 초보자에게 적합한 던전입니다.',
    imageUrl: '/images/dungeons/forest.jpg',
    difficulty: 'easy' as const,
    totalDistance: 1000,
    minLevel: 1,
    maxLevel: 20,
    baseGoldReward: 100,
    baseExperienceReward: 50,
    unlockRequirement: null, // 첫 번째 던전은 바로 해금
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'D2. 사막의 유적',
    description: '고대 문명의 흔적이 남아있는 사막 유적. 중급자에게 도전적인 던전입니다.',
    imageUrl: '/images/dungeons/desert.jpg',
    difficulty: 'medium' as const,
    totalDistance: 1500,
    minLevel: 10,
    maxLevel: 40,
    baseGoldReward: 200,
    baseExperienceReward: 100,
    unlockRequirement: JSON.stringify({ dungeonId: 1, clearCount: 10 }),
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'D3. 얼음 동굴',
    description: '영원히 얼어있는 동굴. 강력한 얼음 몬스터들이 서식합니다.',
    imageUrl: '/images/dungeons/ice-cave.jpg',
    difficulty: 'hard' as const,
    totalDistance: 2000,
    minLevel: 20,
    maxLevel: 60,
    baseGoldReward: 350,
    baseExperienceReward: 175,
    unlockRequirement: JSON.stringify({ dungeonId: 2, clearCount: 25 }),
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'D4. 화산 지대',
    description: '끊임없이 용암이 분출하는 화산. 고급자만이 도전할 수 있는 던전입니다.',
    imageUrl: '/images/dungeons/volcano.jpg',
    difficulty: 'expert' as const,
    totalDistance: 2500,
    minLevel: 35,
    maxLevel: 80,
    baseGoldReward: 500,
    baseExperienceReward: 250,
    unlockRequirement: JSON.stringify({ dungeonId: 3, clearCount: 50 }),
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'D5. 차원의 균열',
    description: '차원과 차원 사이의 균열. 마스터급 실력자만이 도전할 수 있는 최고 난이도 던전입니다.',
    imageUrl: '/images/dungeons/dimension.jpg',
    difficulty: 'master' as const,
    totalDistance: 3000,
    minLevel: 50,
    maxLevel: 100,
    baseGoldReward: 800,
    baseExperienceReward: 400,
    unlockRequirement: JSON.stringify({ dungeonId: 4, clearCount: 100 }),
    displayOrder: 5,
    isActive: true,
  },
]

async function seedDungeons() {
  try {
    console.log('던전 데이터 시딩을 시작합니다...')

    // 기존 던전 데이터 삭제
    await db.delete(dungeons)
    console.log('기존 던전 데이터를 삭제했습니다.')

    // 새 던전 데이터 삽입
    const insertedDungeons = await db.insert(dungeons).values(defaultDungeons).returning()
    
    console.log(`${insertedDungeons.length}개의 던전이 성공적으로 추가되었습니다:`)
    insertedDungeons.forEach(dungeon => {
      console.log(`- ${dungeon.name} (ID: ${dungeon.id})`)
    })

    console.log('던전 시딩이 완료되었습니다!')
  } catch (error) {
    console.error('던전 시딩 중 오류가 발생했습니다:', error)
  } finally {
    process.exit(0)
  }
}

seedDungeons() 