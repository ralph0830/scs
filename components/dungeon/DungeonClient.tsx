'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import useDungeonStore from '@/store/dungeonStore'
import { PartyFormation } from '@/components/dungeon/PartyFormation'
import AvailableCritterList from '@/components/dungeon/AvailableCritterList'
import ExplorationLog from '@/components/dungeon/ExplorationLog'
import { ICritter, IDungeonWithDetails } from '@/types'
import { Play, Lock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface DungeonClientProps {
  initialDungeons: IDungeonWithDetails[];
  initialCritters: ICritter[];
}

export default function DungeonClient({ initialDungeons, initialCritters }: DungeonClientProps) {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const dungeonIdFromUrl = searchParams.get('dungeonId')
  
  const {
    party,
    setParty,
    stopExploration,
    resetDungeon,
    getTotalPower
  } = useDungeonStore()

  const [availableCritters, setAvailableCritters] = useState<ICritter[]>(initialCritters)
  const [explorationInterval, setExplorationInterval] = useState<NodeJS.Timeout | null>(null)
  const [dungeons, setDungeons] = useState<IDungeonWithDetails[]>(initialDungeons)
  const [selectedDungeon, setSelectedDungeon] = useState<IDungeonWithDetails | null>(null)
  const [explorationLogs, setExplorationLogs] = useState<string[]>([])
  const [isExploring, setIsExploring] = useState(false)

  useEffect(() => {
    // URL 파라미터에서 던전 ID가 있으면 해당 던전 선택
    if (dungeonIdFromUrl) {
      const targetDungeon = dungeons.find((dungeon: IDungeonWithDetails) => 
        dungeon.id.toString() === dungeonIdFromUrl
      )
      if (targetDungeon) {
        setSelectedDungeon(targetDungeon)
      }
    } else {
      // 첫 번째 해금된 던전을 기본 선택
      const firstUnlockedDungeon = dungeons.find((dungeon: IDungeonWithDetails) => 
        dungeon.userProgress?.isUnlocked || !dungeon.unlockRequirement
      )
      if (firstUnlockedDungeon) {
        setSelectedDungeon(firstUnlockedDungeon)
      }
    }
  }, [dungeons, dungeonIdFromUrl])

  const handleDungeonSelect = (dungeon: IDungeonWithDetails) => {
    // 해금되지 않은 던전은 선택 불가
    if (!dungeon.userProgress?.isUnlocked && dungeon.unlockRequirement) {
      toast({
        title: '던전 잠금',
        description: '이 던전은 아직 해금되지 않았습니다.',
        variant: 'destructive',
      })
      return
    }
    
    setSelectedDungeon(dungeon)
    setExplorationLogs([])
  }

  const handleRemoveCritter = useCallback((index: number) => {
    const newParty = [...party]
    newParty[index] = null
    setParty(newParty)
  }, [party, setParty])

  const handleAddCritter = useCallback((critter: ICritter) => {
    const emptySlot = party.findIndex(slot => slot === null)
    if (emptySlot !== -1) {
      const newParty = [...party]
      newParty[emptySlot] = critter
      setParty(newParty)
      toast({
        title: "파티 구성",
        description: `${critter.name}이(가) 파티에 추가되었습니다!`
      })
    } else {
      toast({
        title: "파티 가득참",
        description: "파티 슬롯이 가득 찼습니다. 다른 크리터를 제거해주세요.",
        variant: "destructive"
      })
    }
  }, [party, setParty, toast])

  const handleStartExploration = useCallback(async () => {
    if (!selectedDungeon) {
      toast({
        title: '던전을 선택해주세요',
        description: '탐험할 던전을 먼저 선택해주세요.',
        variant: 'destructive',
      })
      return
    }

    if (party.some(slot => slot === null)) {
      toast({
        title: '파티를 완성해주세요',
        description: '3명의 크리터로 파티를 구성해주세요.',
        variant: 'destructive',
      })
      return
    }

    setIsExploring(true)
    setExplorationLogs(['던전 탐험을 시작합니다...'])

    try {
      const response = await fetch('/api/dungeon/explore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dungeonId: selectedDungeon.id,
          party: party.map(critter => critter?.id).filter(Boolean),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setExplorationLogs(prev => [...prev, ...data.logs])
      } else {
        throw new Error('Exploration failed')
      }
    } catch (error) {
      toast({
        title: '탐험 실패',
        description: '던전 탐험 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsExploring(false)
    }
  }, [party, selectedDungeon, setParty, toast])

  const handleStopExploration = useCallback(() => {
    if (explorationInterval) {
      clearInterval(explorationInterval)
      setExplorationInterval(null)
    }
    stopExploration()
    toast({
      title: "탐험 중단",
      description: "던전 탐험이 중단되었습니다."
    })
  }, [explorationInterval, stopExploration, toast])

  useEffect(() => {
    return () => {
      if (explorationInterval) {
        clearInterval(explorationInterval)
      }
    }
  }, [explorationInterval])

  const totalPower = getTotalPower()

  // 던전 통계 요약 계산
  const unlockedCount = dungeons.filter(d => d.userProgress?.isUnlocked || !d.unlockRequirement).length
  const totalClear = dungeons.reduce((sum, d) => sum + (d.userProgress?.clearCount || 0), 0)
  const totalGold = dungeons.reduce((sum, d) => sum + (d.userProgress?.totalGoldEarned || 0), 0)
  const totalExp = dungeons.reduce((sum, d) => sum + (d.userProgress?.totalExperienceEarned || 0), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          던전 탐험
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          크리터들과 함께 던전을 탐험하고 보물을 찾아보세요
        </p>
      </div>

      {/* 던전 통계 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
        <div>
          <div className="text-2xl font-bold text-blue-600">{unlockedCount}</div>
          <div className="text-sm text-gray-500">해금된 던전</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{totalClear}</div>
          <div className="text-sm text-gray-500">총 클리어</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-600">{totalGold}</div>
          <div className="text-sm text-gray-500">총 골드</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{totalExp}</div>
          <div className="text-sm text-gray-500">총 경험</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 던전 선택 (모바일에서는 선택 전, 데스크탑에서는 항상 보임) */}
        <div
          className={`lg:col-span-1 ${
            selectedDungeon ? 'hidden lg:block' : 'block'
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>던전 선택</CardTitle>
              <CardDescription>
                탐험할 던전을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dungeons.map((dungeon: any) => {
                const isUnlocked = dungeon.userProgress?.isUnlocked || !dungeon.unlockRequirement
                const isSelected = selectedDungeon?.id === dungeon.id
                return (
                  <div
                    key={dungeon.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      isUnlocked 
                        ? 'cursor-pointer hover:border-gray-300' 
                        : 'cursor-not-allowed opacity-60'
                    } ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => handleDungeonSelect(dungeon)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{dungeon.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {dungeon.description}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          레벨 {dungeon.minLevel} - {dungeon.maxLevel} / 거리 {dungeon.totalDistance}m
                        </p>
                        {dungeon.userProgress && (
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <p>클리어: <span className="font-bold text-green-700">{dungeon.userProgress.clearCount}</span>회</p>
                            <p>총 탐험 거리: <span className="font-bold">{dungeon.userProgress.totalDistanceExplored}m</span></p>
                            <p>획득 골드: <span className="font-bold text-yellow-600">{dungeon.userProgress.totalGoldEarned}</span></p>
                            <p>획득 경험치: <span className="font-bold text-purple-600">{dungeon.userProgress.totalExperienceEarned}</span></p>
                          </div>
                        )}
                      </div>
                      {!isUnlocked && <Lock className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* 파티 구성 및 탐험 (모바일에서는 선택 후, 데스크탑에서는 항상 보임) */}
        <div
          className={`lg:col-span-2 space-y-8 ${
            selectedDungeon ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedDungeon && (
            <>
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold">{selectedDungeon.name}</h2>
                 <Button
                    variant="outline"
                    onClick={() => setSelectedDungeon(null)}
                    className="lg:hidden"
                  >
                    던전 목록
                  </Button>
              </div>

              {/* 파티 구성 */}
              <Card>
                <CardHeader>
                  <CardTitle>파티 구성</CardTitle>
                  <CardDescription>
                    탐험할 크리터 3마리를 선택하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PartyFormation 
                    party={party} 
                    onRemoveCritter={handleRemoveCritter} 
                    totalPower={totalPower}
                  />
                </CardContent>
              </Card>
              
              {/* 사용 가능한 크리터 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>사용 가능한 크리터</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvailableCritterList 
                    critters={availableCritters} 
                    onAddCritter={handleAddCritter}
                    party={party}
                  />
                </CardContent>
              </Card>

              {/* 탐험 컨트롤 및 로그 */}
              <Card>
                <CardHeader>
                  <CardTitle>탐험 시작</CardTitle>
                </CardHeader>
                <CardContent>
                   <Button 
                    onClick={handleStartExploration} 
                    disabled={isExploring || party.some(p => !p)}
                    className="w-full"
                    size="lg"
                  >
                    {isExploring ? '탐험 중...' : '탐험 시작'}
                  </Button>
                  
                  <ExplorationLog logs={explorationLogs} testId="exploration-log"/>

                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 