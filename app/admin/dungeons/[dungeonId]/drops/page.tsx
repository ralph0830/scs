'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { IDungeon, IItem } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ItemDropForm } from '@/components/admin/ItemDropForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ItemDrop {
  id: number
  dungeonId: number
  itemId: number
  dropRate: number
  minDistance: number
  maxDistance?: number
  item: IItem
}

export default function DungeonDropsPage({ params }: { params: { dungeonId: string } }) {
  const [dungeon, setDungeon] = useState<IDungeon | null>(null)
  const [drops, setDrops] = useState<ItemDrop[]>([])
  const [items, setItems] = useState<IItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDrop, setSelectedDrop] = useState<ItemDrop | null>(null)
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

      // 아이템 드롭 목록 가져오기
      const dropsResponse = await fetch(`/api/admin/dungeons/${dungeonId}/drops`)
      if (dropsResponse.ok) {
        const dropsData = await dropsResponse.json()
        setDrops(dropsData)
      }

      // 전체 아이템 목록 가져오기
      const itemsResponse = await fetch('/api/admin/items')
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json()
        setItems(itemsData)
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
    setSelectedDrop(null)
    setIsFormOpen(true)
  }

  const handleEdit = (drop: ItemDrop) => {
    setSelectedDrop(drop)
    setIsFormOpen(true)
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    fetchData()
  }

  const handleDelete = async (dropId: number) => {
    if (!confirm('정말로 이 아이템 드롭을 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/dungeons/${dungeonId}/drops/${dropId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: '삭제 완료',
          description: '아이템 드롭이 삭제되었습니다.',
        })
        fetchData()
      } else {
        throw new Error('Failed to delete drop')
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '아이템 드롭 삭제에 실패했습니다.',
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
          {dungeon.name} - 아이템 드롭 관리
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          이 던전에서 획득할 수 있는 특별 아이템들을 관리합니다
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>아이템</TableHead>
              <TableHead>드롭률</TableHead>
              <TableHead>거리 범위</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>희귀도</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drops.map((drop) => (
              <TableRow key={drop.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {drop.item.imageUrl && (
                      <img 
                        src={drop.item.imageUrl} 
                        alt={drop.item.name}
                        className="w-8 h-8 mr-2 rounded"
                      />
                    )}
                    {drop.item.name}
                  </div>
                </TableCell>
                <TableCell>{(drop.dropRate * 100).toFixed(2)}%</TableCell>
                <TableCell>
                  {drop.minDistance}m ~ {drop.maxDistance ? `${drop.maxDistance}m` : '끝'}
                </TableCell>
                <TableCell className="capitalize">{drop.item.type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${
                    drop.item.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                    drop.item.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                    drop.item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    drop.item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {drop.item.rarity}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(drop)}
                    >
                      수정
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(drop.id)}
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
          새 아이템 드롭 추가
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedDrop ? '아이템 드롭 수정' : '새 아이템 드롭 추가'}</DialogTitle>
            <DialogDescription>
              {selectedDrop ? '이 아이템 드롭의 정보를 수정합니다.' : '새로운 아이템 드롭을 추가합니다.'}
            </DialogDescription>
          </DialogHeader>
          <ItemDropForm 
            initialData={selectedDrop} 
            onSuccess={handleSuccess}
            dungeonId={dungeonId}
            items={items}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 