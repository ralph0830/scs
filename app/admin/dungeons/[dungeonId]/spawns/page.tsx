'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { IDungeon, IMonster } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { MonsterSpawnForm } from '@/components/admin/MonsterSpawnForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface MonsterSpawn {
  id: number
  dungeonId: number
  monsterId: number
  spawnRate: number
  minLevel: number
  maxLevel: number
  isBoss: boolean
  bossSpawnCondition?: string
  monster: IMonster
}

export default function DungeonSpawnsPage({ params }: { params: { dungeonId: string } }) {
  const [dungeon, setDungeon] = useState<IDungeon | null>(null)
  const [spawns, setSpawns] = useState<MonsterSpawn[]>([])
  const [monsters, setMonsters] = useState<IMonster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSpawn, setSelectedSpawn] = useState<MonsterSpawn | null>(null)
  const { toast } = useToast()

  const dungeonId = parseInt(params.dungeonId)

  useEffect(() => {
    fetchData()
  }, [dungeonId])

  const fetchData = async () => {
    try {
      // 던전 정보 가져오기
      const dungeonResponse = await fetch(`/api/admin/dungeons/${dungeonId}`)
      if (dungeonResponse.ok) {
        const dungeonData = await dungeonResponse.json()
        setDungeon(dungeonData)
      }

      // 몬스터 스폰 목록 가져오기
      const spawnsResponse = await fetch(`/api/admin/dungeons/${dungeonId}/spawns`)
      if (spawnsResponse.ok) {
        const spawnsData = await spawnsResponse.json()
        setSpawns(spawnsData)
      }

      // 전체 몬스터 목록 가져오기
      const monstersResponse = await fetch('/api/admin/monsters')
      if (monstersResponse.ok) {
        const monstersData = await monstersResponse.json()
        setMonsters(monstersData)
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setSelectedSpawn(null)
    setIsFormOpen(true)
  }

  const handleEdit = (spawn: MonsterSpawn) => {
    setSelectedSpawn(spawn)
    setIsFormOpen(true)
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    fetchData()
  }

  const handleDelete = async (spawnId: number) => {
    if (!confirm('정말로 이 몬스터 스폰을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/dungeons/${dungeonId}/spawns/${spawnId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: '삭제 완료',
          description: '몬스터 스폰이 삭제되었습니다.',
        })
        fetchData()
      } else {
        throw new Error('Failed to delete spawn')
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '몬스터 스폰 삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!dungeon) {
    return <div className="text-center py-8">던전을 찾을 수 없습니다.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/dungeons" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          던전 목록으로 돌아가기
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {dungeon.name} - 몬스터 스폰 관리
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          이 던전에서 등장하는 몬스터들을 관리합니다
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>몬스터</TableHead>
              <TableHead>스폰률</TableHead>
              <TableHead>레벨 범위</TableHead>
              <TableHead>보스 여부</TableHead>
              <TableHead>보스 조건</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spawns.map((spawn) => (
              <TableRow key={spawn.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {spawn.monster.emoji && (
                      <span className="mr-2">{spawn.monster.emoji}</span>
                    )}
                    {spawn.monster.name}
                  </div>
                </TableCell>
                <TableCell>{(spawn.spawnRate * 100).toFixed(1)}%</TableCell>
                <TableCell>{spawn.minLevel}~{spawn.maxLevel}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${
                    spawn.isBoss ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {spawn.isBoss ? '보스' : '일반'}
                  </span>
                </TableCell>
                <TableCell>
                  {spawn.bossSpawnCondition ? (
                    <span className="text-sm text-gray-600">
                      {(() => {
                        try {
                          const condition = JSON.parse(spawn.bossSpawnCondition)
                          return `${condition.distance}m, ${(condition.chance * 100).toFixed(1)}%`
                        } catch {
                          return spawn.bossSpawnCondition
                        }
                      })()}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(spawn)}
                    >
                      수정
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(spawn.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 text-center">
        <Button onClick={handleAddNew}>
          새 몬스터 스폰 추가
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedSpawn ? '몬스터 스폰 수정' : '새 몬스터 스폰 추가'}</DialogTitle>
            <DialogDescription>
              {selectedSpawn ? '이 몬스터 스폰의 정보를 수정합니다.' : '새로운 몬스터 스폰을 추가합니다.'}
            </DialogDescription>
          </DialogHeader>
          <MonsterSpawnForm 
            initialData={selectedSpawn} 
            onSuccess={handleSuccess}
            dungeonId={dungeonId}
            monsters={monsters}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 