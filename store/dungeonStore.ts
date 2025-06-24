import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ICritter, IDungeonState, DungeonStatus, IDungeonProgress, IDungeonEvent, IDungeonCombat } from '@/types'

interface IDungeonStore extends IDungeonState {
  // Party management
  setParty: (party: (ICritter | null)[]) => void
  resetParty: () => void
  
  // Dungeon exploration
  startExploration: (areaId: number) => void
  stopExploration: () => void
  updateProgress: (progress: Partial<IDungeonProgress>) => void
  
  // Combat management
  startCombat: (monsters: any[]) => void
  endCombat: () => void
  updateCombat: (combat: Partial<IDungeonCombat>) => void
  
  // Event handling
  addEvent: (event: IDungeonEvent) => void
  clearEvents: () => void
  
  // Utility
  resetDungeon: () => void
  getTotalPower: () => number
}

const initialProgress: IDungeonProgress = {
  distance: 0,
  totalDistance: 1000, // 1000 units to complete dungeon
  events: [],
  rewards: {
    gold: 0,
    items: [],
    experience: 0
  }
}

const useDungeonStore = create<IDungeonStore>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'idle',
      progress: initialProgress,
      party: Array(3).fill(null), // 3-slot party
      
      // Party management
      setParty: (newParty) => set({ party: newParty }),
      resetParty: () => set({ party: Array(3).fill(null) }),
      
      // Dungeon exploration
      startExploration: (areaId) => set({
        status: 'exploring',
        areaId,
        startTime: Date.now(),
        progress: { ...initialProgress, distance: 0 }
      }),
      
      stopExploration: () => set({
        status: 'idle',
        progress: initialProgress
      }),
      
      updateProgress: (newProgress) => set((state) => ({
        progress: { ...state.progress, ...newProgress }
      })),
      
      // Combat management
      startCombat: (monsters) => {
        const { party } = get()
        const partyHp = party.map(critter => critter ? critter.baseHp * 10 : 0)
        const monsterHp = monsters.map(monster => monster.baseHp)
        
        set({
          status: 'in_combat',
          progress: {
            ...get().progress,
            combat: {
              monsters,
              currentMonsterIndex: 0,
              partyHp,
              monsterHp,
              turn: 1,
              isPlayerTurn: true
            }
          }
        })
      },
      
      endCombat: () => set((state) => ({
        status: 'exploring',
        progress: {
          ...state.progress,
          combat: undefined
        }
      })),
      
      updateCombat: (newCombat) => set((state) => ({
        progress: {
          ...state.progress,
          combat: state.progress.combat ? { ...state.progress.combat, ...newCombat } : undefined
        }
      })),
      
      // Event handling
      addEvent: (event) => set((state) => ({
        progress: {
          ...state.progress,
          events: [...state.progress.events, event]
        }
      })),
      
      clearEvents: () => set((state) => ({
        progress: {
          ...state.progress,
          events: []
        }
      })),
      
      // Utility
      resetDungeon: () => set({
        status: 'idle',
        progress: initialProgress,
        areaId: undefined,
        startTime: undefined
      }),
      
      getTotalPower: () => {
        const { party } = get()
        return party.reduce((total, critter) => {
          if (!critter) return total
          const attack = Number(critter.baseAttack) || 0
          const defense = Number(critter.baseDefense) || 0
          return total + attack + defense
        }, 0)
      }
    }),
    {
      name: 'dungeon-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    (window as any).dungeonStore = useDungeonStore;
  }
}

export default useDungeonStore 