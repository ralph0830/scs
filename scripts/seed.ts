import 'dotenv/config'
import { db } from '../db'
import { users, critters, critterTypes, typeMatchups, monsters, monsterSkills, monsterSkillAssignments, dungeonAreas, monsterSpawns, items, dungeonPartySlots, dungeonParties, userCritters } from '../db/schema'
import { readFileSync } from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

type TypeName = (typeof critterTypes)[number];

const matchups: { [key in TypeName]?: { [key in TypeName]?: number } } = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, grass: 0.5, electric: 2, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

async function seedUsers() {
  console.log('Seeding users...');
  const saltRounds = 10;
  const testUserPassword = await bcrypt.hash('password123', saltRounds);
  const adminUserPassword = await bcrypt.hash('admin', saltRounds);

  await db.insert(users).values([
    { id: 'testuser', username: 'testuser', password: testUserPassword, isAdmin: false },
    { id: 'admin', username: 'admin', password: adminUserPassword, isAdmin: true },
  ]);
  console.log('Users seeded.');
}

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Clear all data
  console.log('Clearing old data...');
  await db.delete(dungeonPartySlots);
  await db.delete(dungeonParties);
  await db.delete(userCritters);
  await db.delete(monsterSpawns);
  await db.delete(monsterSkillAssignments);
  await db.delete(items);
  await db.delete(users);
  await db.delete(monsterSkills);
  await db.delete(monsters);
  await db.delete(dungeonAreas);
  await db.delete(typeMatchups);
  await db.delete(critters);
  console.log('Old data cleared.');

  // 2. Seed data
  console.log('Seeding new data...');
  
  await seedUsers();
  
  const critterData: (typeof critters.$inferInsert)[] = [
    { name: '아쿠아핀', type: 'water', description: '물 장난을 좋아하는 강아지 크리터.' },
    { name: '파이로', type: 'fire', description: '불처럼 뜨거운 성격의 고양이 크리터.' },
    { name: '리프링', type: 'grass', description: '숲의 기운을 받은 풀잎 크리터.' },
  ];
  await db.insert(critters).values(critterData);
  console.log('Critters seeded.');

  const typeMatchupData: (typeof typeMatchups.$inferInsert)[] = [
    { attackingType: 'fire', defendingType: 'water', multiplier: 0.5 },
    { attackingType: 'water', defendingType: 'fire', multiplier: 2.0 },
  ];
  await db.insert(typeMatchups).values(typeMatchupData);
  console.log('Type matchups seeded.');

  const seededSkills = await db.insert(monsterSkills).values([
    { name: '발톱 베기', type: 'normal' },
    { name: '화염 숨결', type: 'fire' },
  ]).returning({ id: monsterSkills.id, name: monsterSkills.name });
  console.log('Monster skills seeded.');

  const seededMonsters = await db.insert(monsters).values([
      { name: '고블린', type: 'normal' },
      { name: '늑대', type: 'normal' },
  ]).returning({ id: monsters.id, name: monsters.name });
  console.log('Monsters seeded.');
  
  const seededDungeons = await db.insert(dungeonAreas).values([
      { name: 'D1. 마법의 숲', difficulty: 'easy' },
      { name: 'D2. 어두운 동굴', difficulty: 'medium', unlockRequirement: 'D1. 마법의 숲 완료' },
  ]).returning({ id: dungeonAreas.id, name: dungeonAreas.name });
  console.log('Dungeon areas seeded.');
  
  const goblin = seededMonsters.find(m => m.name === '고블린');
  const wolf = seededMonsters.find(m => m.name === '늑대');
  const forest = seededDungeons.find(d => d.name === 'D1. 마법의 숲');

  if (goblin && wolf && forest) {
      await db.insert(monsterSpawns).values([
          { areaId: forest.id, monsterId: goblin.id, spawnRate: 0.5, isBoss: false },
          { areaId: forest.id, monsterId: wolf.id, spawnRate: 0.2, isBoss: true },
      ]);
      console.log('Monster spawns seeded.');
  }

  const clawSlash = seededSkills.find(s => s.name === '발톱 베기');
  const fireBreath = seededSkills.find(s => s.name === '화염 숨결');

  if (goblin && wolf && clawSlash && fireBreath) {
      await db.insert(monsterSkillAssignments).values([
          { monsterId: goblin.id, skillId: clawSlash.id, levelRequired: 1 },
          { monsterId: wolf.id, skillId: fireBreath.id, levelRequired: 5 },
      ]);
      console.log('Monster skill assignments seeded.');
  }

  console.log('✅ Database seeded successfully!');
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
}); 