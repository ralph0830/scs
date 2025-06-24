import { critterTypes } from "@/db/schema";

export type CritterType = typeof critterTypes[number];

export interface ICritter {
  id: number;
  name: string;
  description: string | null;
  emoji: string | null;
  imageUrl: string | null;
  type: CritterType;
  level?: number;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  hpGrowth: number;
  attackGrowth: number;
  defenseGrowth: number;
  createdAt?: string;
  updatedAt?: string;
} 

export interface IComment {
  id: string;
  text: string;
  author: string;
}

// Monster related types
export type MonsterRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export interface IMonster {
  id: number;
  name: string;
  description: string | null;
  emoji: string | null;
  imageUrl: string | null;
  type: CritterType;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  hpGrowth: number;
  attackGrowth: number;
  defenseGrowth: number;
  rarity: MonsterRarity;
  minLevel: number;
  maxLevel: number;
  experienceReward: number;
  goldReward: number;
  dropRate: number;
}

export interface IMonsterSkill {
  id: number;
  name: string;
  description: string | null;
  power: number;
  type: CritterType;
  cooldown: number;
}

export interface IMonsterSkillAssignment {
  monsterId: number;
  skillId: number;
  levelRequired: number;
}

export interface IDungeonArea {
  id: number;
  name: string;
  description: string | null;
  minLevel: number;
  maxLevel: number;
  difficulty: DifficultyLevel;
  unlockRequirement: string | null;
  backgroundImage: string | null;
}

export interface IMonsterSpawn {
  id: number;
  areaId: number;
  monsterId: number;
  spawnRate: number;
  minLevel: number;
  maxLevel: number;
  isBoss: boolean;
}

// Dungeon System Types
export type DungeonEventType = 'monster' | 'item' | 'buff' | 'debuff' | 'rest' | 'boss';
export type DungeonStatus = 'idle' | 'exploring' | 'in_combat' | 'completed' | 'failed';

export interface IDungeonEvent {
  type: DungeonEventType;
  description: string;
  duration?: number; // seconds
  effect?: {
    type: 'hp' | 'attack' | 'defense' | 'speed';
    value: number;
  };
}

export interface IDungeonCombat {
  monsters: IMonster[];
  currentMonsterIndex: number;
  partyHp: number[];
  monsterHp: number[];
  turn: number;
  isPlayerTurn: boolean;
}

export interface IDungeonProgress {
  distance: number;
  totalDistance: number;
  events: IDungeonEvent[];
  combat?: IDungeonCombat;
  rewards: {
    gold: number;
    items: any[];
    experience: number;
  };
  areaId?: number;
  startTime?: number;
}

export interface IDungeonState {
  status: DungeonStatus;
  progress: IDungeonProgress;
  party: (ICritter | null)[];
  areaId?: number;
  startTime?: number;
}

// Dungeon System Types (Refactored based on schema.ts)
export interface IDungeon {
  id: number
  name: string
  description: string | null
  minLevel: number
  maxLevel: number
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master'
  unlockRequirement: string | null
  backgroundImage: string | null
}

export interface IUserDungeonProgress {
  userId: string
  dungeonId: number
  clearCount: number
  maxDistance: number
  totalGoldEarned: number
  totalExperienceEarned: number
  isUnlocked: boolean
}

export interface IDungeonMonsterSpawn {
  id: number
  dungeonId: number
  monsterId: number
  spawnRate: number
  minLevel: number
  maxLevel: number
  isBoss: boolean
  bossSpawnCondition?: string // JSON string
  maxDistance?: number
  createdAt: Date
}

export interface IDungeonItemDrop {
  id: number
  dungeonId: number
  itemId: number
  dropRate: number
  minDistance: number
  maxDistance?: number
  createdAt: Date
}

// Dungeon with relations
export interface IDungeonWithDetails extends IDungeon {
  monsterSpawns?: IDungeonMonsterSpawn[]
  itemDrops?: IDungeonItemDrop[]
  userProgress?: IUserDungeonProgress
}

// Unlock requirement type
export interface IUnlockRequirement {
  dungeonId: number
  clearCount: number
}

// Boss spawn condition type
export interface IBossSpawnCondition {
  distance: number
  chance: number
}

// Dungeon exploration state
export interface IDungeonExplorationState {
  isActive: boolean
  currentDistance: number
  totalDistance: number
  events: IDungeonEvent[]
  party: ICritter[]
  rewards: {
    gold: number
    experience: number
    items: IItem[]
  }
  startTime: Date
  lastEventTime: Date
}

export interface IItem {
  id: number
  name: string
  description?: string | null
  type: string
  rarity: string
  imageUrl?: string
  effect?: string
  price?: number
}

export interface ITypeMatchup {
    attackingType: CritterType;
    defendingType: CritterType;
    effectiveness: number;
} 