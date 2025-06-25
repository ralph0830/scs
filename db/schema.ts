import { sqliteTable, text, integer, primaryKey, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const critterTypes = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
] as const;

// All available critter types in the game
export const critters = sqliteTable('critters', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  emoji: text('emoji'),
  imageUrl: text('image_url'),
  type: text('type', { enum: critterTypes }).default('normal').notNull(),
  
  // Base stats
  baseHp: integer('base_hp').default(10).notNull(),
  baseAttack: integer('base_attack').default(5).notNull(),
  baseDefense: integer('base_defense').default(5).notNull(),

  // Stat growth per level
  hpGrowth: real('hp_growth').default(1.1).notNull(),
  attackGrowth: real('attack_growth').default(1.1).notNull(),
  defenseGrowth: real('defense_growth').default(1.1).notNull(),
});

// Skills that critters can learn
export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  power: integer('power').default(10).notNull(),
  type: text('type', { enum: critterTypes }).default('normal').notNull(),
});

// Join table for the many-to-many relationship between critters and skills
export const critterSkills = sqliteTable(
  'critter_skills',
  {
    critterId: integer('critter_id').notNull().references(() => critters.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.critterId, t.skillId] }),
  })
);

// New table for type matchups
export const typeMatchups = sqliteTable('type_matchups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  attackingType: text('attacking_type', { enum: critterTypes }).notNull(),
  defendingType: text('defending_type', { enum: critterTypes }).notNull(),
  multiplier: real('multiplier').default(1).notNull(),
});

// Users table for local authentication
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false).notNull(),
  gold: integer('gold').default(1000).notNull(),
  diamonds: integer('diamonds').default(100).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Instances of critters owned by users
export const userCritters = sqliteTable(
  'user_critters',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    critterId: integer('critter_id')
      .notNull()
      .references(() => critters.id),
    level: integer('level').default(1).notNull(),
    hp: integer('hp').notNull(),
    attack: integer('attack').notNull(),
    defense: integer('defense').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  },
);

// Dungeon exploration parties
export const dungeonParties = sqliteTable('dungeon_parties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').default('Default Party').notNull(),
});

export const dungeonPartySlots = sqliteTable('dungeon_party_slots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  partyId: integer('party_id')
    .notNull()
    .references(() => dungeonParties.id, { onDelete: 'cascade' }),
  slotPosition: integer('slot_position').notNull(),
  userCritterId: integer('user_critter_id').references(() => userCritters.id, {
    onDelete: 'set null',
  }),
});

// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  userCritters: many(userCritters),
  dungeonParties: many(dungeonParties),
  userDungeonProgress: many(userDungeonProgress),
}));

export const crittersRelations = relations(critters, ({ many }) => ({
  userCritters: many(userCritters),
  skills: many(critterSkills),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  critters: many(critterSkills),
}));

export const critterSkillsRelations = relations(critterSkills, ({ one }) => ({
  critter: one(critters, {
    fields: [critterSkills.critterId],
    references: [critters.id],
  }),
  skill: one(skills, {
    fields: [critterSkills.skillId],
    references: [skills.id],
  }),
}));

export const userCrittersRelations = relations(userCritters, ({ one }) => ({
  user: one(users, {
    fields: [userCritters.userId],
    references: [users.id],
  }),
  critter: one(critters, {
    fields: [userCritters.critterId],
    references: [critters.id],
  }),
  dungeonPartySlot: one(dungeonPartySlots),
}));

export const dungeonPartiesRelations = relations(dungeonParties, ({ one, many }) => ({
  user: one(users, {
    fields: [dungeonParties.userId],
    references: [users.id],
  }),
  slots: many(dungeonPartySlots),
}));

export const dungeonPartySlotsRelations = relations(dungeonPartySlots, ({ one }) => ({
  party: one(dungeonParties, {
    fields: [dungeonPartySlots.partyId],
    references: [dungeonParties.id],
  }),
  userCritter: one(userCritters, {
    fields: [dungeonPartySlots.userCritterId],
    references: [userCritters.id],
  }),
}));

// Monster tables for dungeon enemies
export const monsters = sqliteTable('monsters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  emoji: text('emoji'),
  imageUrl: text('image_url'),
  type: text('type', { enum: critterTypes }).default('normal').notNull(),
  
  // Base stats
  baseHp: integer('base_hp').default(10).notNull(),
  baseAttack: integer('base_attack').default(5).notNull(),
  baseDefense: integer('base_defense').default(5).notNull(),

  // Stat growth per level
  hpGrowth: real('hp_growth').default(1.1).notNull(),
  attackGrowth: real('attack_growth').default(1.1).notNull(),
  defenseGrowth: real('defense_growth').default(1.1).notNull(),

  // Monster specific properties
  rarity: text('rarity', { enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'] }).default('common').notNull(),
  minLevel: integer('min_level').default(1).notNull(),
  maxLevel: integer('max_level').default(100).notNull(),
  experienceReward: integer('experience_reward').default(10).notNull(),
  goldReward: integer('gold_reward').default(5).notNull(),
  dropRate: real('drop_rate').default(0.1).notNull(), // 10% default drop rate
});

// Monster skills (monsters can have different skills than critters)
export const monsterSkills = sqliteTable('monster_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  power: integer('power').default(10).notNull(),
  type: text('type', { enum: critterTypes }).default('normal').notNull(),
  cooldown: integer('cooldown').default(0).notNull(), // Turns before skill can be used again
});

// Join table for monsters and their skills
export const monsterSkillAssignments = sqliteTable(
  'monster_skill_assignments',
  {
    monsterId: integer('monster_id').notNull().references(() => monsters.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id').notNull().references(() => monsterSkills.id, { onDelete: 'cascade' }),
    levelRequired: integer('level_required').default(1).notNull(), // At what level monster learns this skill
  },
  (t) => ({
    pk: primaryKey({ columns: [t.monsterId, t.skillId] }),
  })
);

// Dungeon areas/zones
export const dungeonAreas = sqliteTable('dungeon_areas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  minLevel: integer('min_level').default(1).notNull(),
  maxLevel: integer('max_level').default(100).notNull(),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard', 'expert', 'master'] }).default('easy').notNull(),
  unlockRequirement: text('unlock_requirement'), // e.g., "Complete Forest Path"
  backgroundImage: text('background_image'),
});

// Monster spawns in dungeon areas
export const monsterSpawns = sqliteTable('monster_spawns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  areaId: integer('area_id').notNull().references(() => dungeonAreas.id, { onDelete: 'cascade' }),
  monsterId: integer('monster_id').notNull().references(() => monsters.id, { onDelete: 'cascade' }),
  spawnRate: real('spawn_rate').default(0.1).notNull(),
  minLevel: integer('min_level').default(1).notNull(),
  maxLevel: integer('max_level').default(100).notNull(),
  isBoss: integer('is_boss', { mode: 'boolean' }).default(false).notNull(),
});

// Monster relations
export const monstersRelations = relations(monsters, ({ many }) => ({
  skills: many(monsterSkillAssignments),
  spawns: many(monsterSpawns),
}));

export const monsterSkillsRelations = relations(monsterSkills, ({ many }) => ({
  monsters: many(monsterSkillAssignments),
}));

export const monsterSkillAssignmentsRelations = relations(monsterSkillAssignments, ({ one }) => ({
  monster: one(monsters, {
    fields: [monsterSkillAssignments.monsterId],
    references: [monsters.id],
  }),
  skill: one(monsterSkills, {
    fields: [monsterSkillAssignments.skillId],
    references: [monsterSkills.id],
  }),
}));

// Items that can be found or bought
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  type: text('type').notNull(), // item_types.value 참조
  // buyPrice: integer('buy_price'), // 구매가 필드 제거
  sellPrice: integer('sell_price'),
  gemPrice: text('gem_price'),
  feedPower: text('feed_power'),
  importantVal: text('important_val'),
  stats: text('stats'),
  statsEng: text('stats_eng'),
  equipmentType: text('equipment_type'), // 무기/방어구/액세서리 등
});

// User's inventory
export const userItems = sqliteTable(
  'user_items',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    itemId: integer('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').default(1).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.itemId] }),
  })
);

// Item drops in dungeons - Now references dungeonAreas
export const dungeonItemDrops = sqliteTable(
  'dungeon_item_drops',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    areaId: integer('area_id').notNull().references(() => dungeonAreas.id, { onDelete: 'cascade' }),
    itemId: integer('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
    dropRate: real('drop_rate').default(0.05).notNull(),
  },
);

// User progress in dungeons - Now references dungeonAreas
export const userDungeonProgress = sqliteTable(
  'user_dungeon_progress',
  {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    dungeonId: integer('dungeon_id').notNull().references(() => dungeonAreas.id, { onDelete: 'cascade' }),
    clearCount: integer('clear_count').default(0).notNull(),
    maxDistance: integer('max_distance').default(0).notNull(),
    totalGoldEarned: integer('total_gold_earned').default(0).notNull(),
    totalExperienceEarned: integer('total_experience_earned').default(0).notNull(),
    isUnlocked: integer('is_unlocked', { mode: 'boolean' }).default(false).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.dungeonId] }),
  })
);

// Relations for dungeonAreas
export const dungeonAreasRelations = relations(dungeonAreas, ({ many }) => ({
  monsterSpawns: many(monsterSpawns),
  itemDrops: many(dungeonItemDrops),
  userProgress: many(userDungeonProgress),
}));

export const monsterSpawnsRelations = relations(monsterSpawns, ({ one }) => ({
  area: one(dungeonAreas, {
    fields: [monsterSpawns.areaId],
    references: [dungeonAreas.id],
  }),
  monster: one(monsters, {
    fields: [monsterSpawns.monsterId],
    references: [monsters.id],
  }),
}));

export const itemsRelations = relations(items, ({ many }) => ({
  dungeonDrops: many(dungeonItemDrops),
}));

export const dungeonItemDropsRelations = relations(dungeonItemDrops, ({ one }) => ({
  area: one(dungeonAreas, {
    fields: [dungeonItemDrops.areaId],
    references: [dungeonAreas.id],
  }),
  item: one(items, {
    fields: [dungeonItemDrops.itemId],
    references: [items.id],
  }),
}));

export const userDungeonProgressRelations = relations(userDungeonProgress, ({ one }) => ({
  user: one(users, {
    fields: [userDungeonProgress.userId],
    references: [users.id],
  }),
  dungeon: one(dungeonAreas, {
    fields: [userDungeonProgress.dungeonId],
    references: [dungeonAreas.id],
  }),
}));

export const itemTypes = sqliteTable('item_types', {
  value: text('value').primaryKey(), // 예: "10"
  text: text('text').notNull(),      // 한글명: "일반재료"
  textEng: text('text_eng'),         // 영문명: "Material"
  category: text('category'),        // 대분류(예: "material", "equipment" 등)
}); 