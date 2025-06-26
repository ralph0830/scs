'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DungeonForm } from '@/components/admin/DungeonForm'
import Link from 'next/link'

const difficultyLabels: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
  expert: '전문가',
  master: '마스터',
}

function parseUnlockRequirement(unlockRequirement: string | null, idNameMap: Record<number, string>): string {
  if (!unlockRequirement) return '바로 해금';
  try {
    const obj = JSON.parse(unlockRequirement);
    if (typeof obj === 'object' && obj.type && Array.isArray(obj.requirements)) {
      const conds = obj.requirements.map((r: any) => `${idNameMap[r.dungeonId] || `ID${r.dungeonId}`}:${r.clearCount}회`).join(` ${obj.type} `);
      return conds;
    }
    return unlockRequirement;
  } catch {
    return unlockRequirement;
  }
}

export default function AdminDungeonsPage() {
  const [dungeons, setDungeons] = useState<any[]>([])
  const [idNameMap, setIdNameMap] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDungeon, setSelectedDungeon] = useState<any | null>(null)

  const fetchDungeons = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/dungeons')
      if (response.ok) {
        const data = await response.json()
        setDungeons(data.dungeons)
        setIdNameMap(data.idNameMap)
      } else {
        throw new Error('Failed to fetch dungeons')
      }
    } catch (error) {
      toast.error('던전 목록을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDungeons()
  }, [fetchDungeons])

  const handleAddNew = () => {
    setSelectedDungeon(null)
    setIsFormOpen(true)
  }

  const handleEdit = (dungeon: any) => {
    setSelectedDungeon(dungeon)
    setIsFormOpen(true)
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    fetchDungeons()
  }

  const handleDelete = async (dungeonId: number) => {
    if (!confirm('정말로 이 던전을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/dungeons/${dungeonId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('던전이 삭제되었습니다.')
        fetchDungeons()
      } else {
        throw new Error('Failed to delete dungeon')
      }
    } catch (error) {
      toast.error('던전 삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }
  
  return (
    <div className="bg-[#222] text-gray-100 min-h-screen">
      <main className="px-2 py-4 bg-[#222] min-h-screen">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          <div className="bg-[#333] border border-[#444] rounded-xl p-4 shadow mb-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">던전 관리</h1>
              <Button onClick={handleAddNew}>던전 추가</Button>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <Table className="bg-[#333] text-gray-100">
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>난이도</TableHead>
                    <TableHead>레벨 범위</TableHead>
                    <TableHead>해금 조건</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dungeons.map((dungeon) => (
                    <TableRow key={dungeon.id}>
                      <TableCell className="font-medium">{dungeon.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm`}>
                          {difficultyLabels[dungeon.difficulty] ?? dungeon.difficulty}
                        </span>
                      </TableCell>
                      <TableCell>{`${dungeon.minLevel}~${dungeon.maxLevel}`}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{parseUnlockRequirement(dungeon.unlockRequirement, idNameMap)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(dungeon)}
                          >
                            수정
                          </Button>
                          <Link href={`/admin/dungeons/${dungeon.id}/spawns`}>
                            <Button size="sm" variant="secondary">
                              몬스터
                            </Button>
                          </Link>
                          <Link href={`/admin/dungeons/${dungeon.id}/drops`}>
                             <Button size="sm" variant="secondary">
                               아이템
                             </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDelete(dungeon.id)}
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
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={handleAddNew}>
            새 던전 추가
          </Button>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[800px] bg-[#333] text-gray-100 border-[#444]">
            <DialogHeader>
              <DialogTitle>{selectedDungeon ? '던전 수정' : '새 던전 추가'}</DialogTitle>
              <DialogDescription>
                {selectedDungeon ? '이 던전의 정보를 수정합니다.' : '새로운 던전을 추가합니다.'}
              </DialogDescription>
            </DialogHeader>
            <DungeonForm initialData={selectedDungeon} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 