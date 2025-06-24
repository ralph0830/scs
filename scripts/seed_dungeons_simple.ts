import { db } from '../db'
import { dungeonAreas } from '../db/schema'
import { eq } from 'drizzle-orm'

const defaultDungeonAreas = [
  {
    name: 'D1. 마법의 숲',
    description: '신비로운 생물들이 서식하는 고대 숲입니다.',
    minLevel: 1,
    maxLevel: 10,
    difficulty: 'easy' as const,
    backgroundImage: '/images/dungeons/forest.jpg',
  },
  {
    name: 'D2. 모래의 사막',
    description: '뜨거운 모래와 위험한 괴물들로 가득한 사막입니다.',
    minLevel: 10,
    maxLevel: 20,
    difficulty: 'medium' as const,
    unlockRequirement: '마법의 숲 클리어',
    backgroundImage: '/images/dungeons/desert.jpg',
  },
  {
    name: 'D3. 얼음 동굴',
    description: '모든 것이 얼어붙은 차가운 동굴입니다.',
    minLevel: 20,
    maxLevel: 30,
    difficulty: 'hard' as const,
    unlockRequirement: '모래의 사막 클리어',
    backgroundImage: '/images/dungeons/ice-cave.jpg',
  },
  {
    name: 'D4. 불타는 화산',
    description: '용암이 들끓는 위험한 화산 지대입니다.',
    minLevel: 30,
    maxLevel: 40,
    difficulty: 'expert' as const,
    unlockRequirement: '얼음 동굴 클리어',
    backgroundImage: '/images/dungeons/volcano.jpg',
  },
  {
    name: 'D5. 차원의 균열',
    description: '현실과 다른 차원이 뒤섞인 불안정한 공간입니다.',
    minLevel: 40,
    maxLevel: 50,
    difficulty: 'master' as const,
    unlockRequirement: '불타는 화산 클리어',
    backgroundImage: '/images/dungeons/dimension.jpg',
  },
]

async function main() {
  console.log('Seeding dungeon areas...')

  // Clear existing data
  await db.delete(dungeonAreas)
  console.log('Cleared existing dungeon areas.')

  // Insert new data
  const insertedDungeonAreas = await db.insert(dungeonAreas).values(defaultDungeonAreas).returning()

  console.log(`Seeded ${insertedDungeonAreas.length} dungeon areas.`)
  console.log(insertedDungeonAreas)
}

main()
  .catch((e) => {
    console.error('Failed to seed dungeon areas:', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  }) 