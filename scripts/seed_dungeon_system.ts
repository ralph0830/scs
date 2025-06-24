import { drizzle } from 'drizzle-orm/d1'
import { sql } from 'drizzle-orm'
import { 
  dungeons, 
  dungeonMonsterSpawns, 
  dungeonItemDrops,
  monsters,
  items
} from '../db/schema'
import { db } from '../db'

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

async function seedDungeonSystem() {
  console.log('🌍 던전 시스템 시드 데이터 생성 시작...')
  
  try {
    // 던전 데이터 삽입
    const insertedDungeons = await db.insert(dungeons).values(DUNGEON_DATA).returning()
    console.log(`✅ ${insertedDungeons.length}개의 던전이 생성되었습니다.`)
    
    // 몬스터 ID 매핑 생성
    const allMonsters = await db.select().from(monsters)
    const monsterNameToId = new Map(allMonsters.map(m => [m.name, m.id]))
    
    // 던전별 몬스터 스폰 설정
    const dungeonSpawns = []
    
    // D1 몬스터 스폰
    for (const monsterName of D1_MONSTERS) {
      const monsterId = monsterNameToId.get(monsterName)
      if (monsterId) {
        dungeonSpawns.push({
          dungeonId: 1,
          monsterId,
          spawnRate: 0.15,
          minLevel: 1,
          maxLevel: 20,
          isBoss: false,
          bossSpawnCondition: null
        })
      }
    }
    
    // D2 몬스터 스폰
    for (const monsterName of D2_MONSTERS) {
      const monsterId = monsterNameToId.get(monsterName)
      if (monsterId) {
        dungeonSpawns.push({
          dungeonId: 2,
          monsterId,
          spawnRate: 0.18,
          minLevel: 10,
          maxLevel: 40,
          isBoss: false,
          bossSpawnCondition: null
        })
      }
    }
    
    // D3 몬스터 스폰
    for (const monsterName of D3_MONSTERS) {
      const monsterId = monsterNameToId.get(monsterName)
      if (monsterId) {
        dungeonSpawns.push({
          dungeonId: 3,
          monsterId,
          spawnRate: 0.20,
          minLevel: 20,
          maxLevel: 60,
          isBoss: false,
          bossSpawnCondition: null
        })
      }
    }
    
    // D4 몬스터 스폰
    for (const monsterName of D4_MONSTERS) {
      const monsterId = monsterNameToId.get(monsterName)
      if (monsterId) {
        dungeonSpawns.push({
          dungeonId: 4,
          monsterId,
          spawnRate: 0.22,
          minLevel: 30,
          maxLevel: 80,
          isBoss: false,
          bossSpawnCondition: null
        })
      }
    }
    
    // D5 몬스터 스폰
    for (const monsterName of D5_MONSTERS) {
      const monsterId = monsterNameToId.get(monsterName)
      if (monsterId) {
        dungeonSpawns.push({
          dungeonId: 5,
          monsterId,
          spawnRate: 0.25,
          minLevel: 50,
          maxLevel: 100,
          isBoss: false,
          bossSpawnCondition: null
        })
      }
    }
    
    // 보스 몬스터 설정 (각 던전의 마지막 몬스터를 보스로 설정)
    const bossMonsters = [
      { dungeonId: 1, monsterName: '숲의 정령' },
      { dungeonId: 2, monsterName: '모래 석상' },
      { dungeonId: 3, monsterName: '서리 드래곤' },
      { dungeonId: 4, monsterName: '다크 마법사' },
      { dungeonId: 5, monsterName: '천상의 드래곤' }
    ]
    
    for (const boss of bossMonsters) {
      const monsterId = monsterNameToId.get(boss.monsterName)
      if (monsterId) {
        // 기존 스폰을 보스로 업데이트
        const existingSpawn = dungeonSpawns.find(s => s.dungeonId === boss.dungeonId && s.monsterId === monsterId)
        if (existingSpawn) {
          existingSpawn.isBoss = true
          existingSpawn.spawnRate = 0.05 // 보스는 낮은 스폰률
          existingSpawn.bossSpawnCondition = JSON.stringify({ distance: 800, chance: 0.1 })
        }
      }
    }
    
    // 몬스터 스폰 데이터 삽입
    if (dungeonSpawns.length > 0) {
      await db.insert(dungeonMonsterSpawns).values(dungeonSpawns)
      console.log(`✅ ${dungeonSpawns.length}개의 몬스터 스폰이 설정되었습니다.`)
    }
    
    // 특별 아이템 드롭 설정 (각 던전별 고유 아이템)
    const specialItems = await db.select().from(items).where(sql`rarity IN ('rare', 'epic', 'legendary')`).limit(50)
    
    const dungeonDrops = []
    for (let dungeonId = 1; dungeonId <= 5; dungeonId++) {
      // 각 던전당 5-10개의 특별 아이템 드롭 설정
      const itemsForDungeon = specialItems.slice((dungeonId - 1) * 8, dungeonId * 8)
      
      for (const item of itemsForDungeon) {
        dungeonDrops.push({
          dungeonId,
          itemId: item.id,
          dropRate: 0.03 + (dungeonId * 0.01), // 던전이 어려울수록 드롭률 증가
          minDistance: dungeonId * 200, // 던전별 최소 거리
          maxDistance: null // 전체 거리에서 드롭 가능
        })
      }
    }
    
    // 아이템 드롭 데이터 삽입
    if (dungeonDrops.length > 0) {
      await db.insert(dungeonItemDrops).values(dungeonDrops)
      console.log(`✅ ${dungeonDrops.length}개의 특별 아이템 드롭이 설정되었습니다.`)
    }
    
    console.log('🎉 던전 시스템 시드 데이터 생성 완료!')
    console.log('\n📊 생성된 던전 정보:')
    
    for (const dungeon of insertedDungeons) {
      const spawns = dungeonSpawns.filter(s => s.dungeonId === dungeon.id)
      const drops = dungeonDrops.filter(d => d.dungeonId === dungeon.id)
      
      console.log(`\n${dungeon.name}`)
      console.log(`  - 난이도: ${dungeon.difficulty}`)
      console.log(`  - 길이: ${dungeon.totalDistance}m`)
      console.log(`  - 몬스터: ${spawns.length}종`)
      console.log(`  - 특별 아이템: ${drops.length}종`)
      console.log(`  - 해금 조건: ${dungeon.unlockRequirement || '없음'}`)
    }
    
  } catch (error) {
    console.error('❌ 던전 시스템 시드 데이터 생성 실패:', error)
    throw error
  }
}

// 스크립트 실행
if (require.main === module) {
  seedDungeonSystem()
    .then(() => {
      console.log('✅ 던전 시스템 시드 스크립트 완료')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 던전 시스템 시드 스크립트 실패:', error)
      process.exit(1)
    })
}

export { seedDungeonSystem } 