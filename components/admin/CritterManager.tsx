'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { ICritter } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { CritterForm } from '@/components/admin/CritterForm'

const typeLabels: Record<string, string> = {
  normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', dark: '악', fairy: '페어리',
}

interface CritterManagerProps {
  initialCritters: ICritter[]
}

export default function CritterManager({ initialCritters }: CritterManagerProps) {
  const [critters, setCritters] = useState<ICritter[]>(initialCritters)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCritter, setSelectedCritter] = useState<ICritter | null>(null)
  const { toast } = useToast()

  const fetchCritters = async () => {
    try {
      const response = await fetch('/api/critters')
      if (response.ok) {
        const data = await response.json()
        setCritters(data)
      } else {
        throw new Error('Failed to fetch critters')
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '크리터 목록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleAddNew = () => {
    setSelectedCritter(null)
    setIsFormOpen(true)
  }

  const handleEdit = (critter: ICritter) => {
    setSelectedCritter(critter)
    setIsFormOpen(true)
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    fetchCritters()
  }

  const handleDelete = async (critterId: number) => {
    if (!confirm('정말로 이 크리터를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/critters/${critterId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: '삭제 완료',
          description: '크리터가 삭제되었습니다.',
        })
        fetchCritters()
      } else {
        throw new Error('Failed to delete critter')
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '크리터 삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          크리터 관리
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          게임 내 크리터들을 관리합니다
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>이름</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>기본 HP</TableHead>
              <TableHead>기본 공격</TableHead>
              <TableHead>기본 방어</TableHead>
              <TableHead>HP 성장률</TableHead>
              <TableHead>공격 성장률</TableHead>
              <TableHead>방어 성장률</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {critters.map((critter) => (
              <TableRow key={critter.id}>
                <TableCell>
                  <img
                    src={critter.imageUrl && critter.imageUrl.trim() !== '' ? critter.imageUrl : '/critters/no-image.png'}
                    alt={critter.name + ' 이미지'}
                    className="w-10 h-10 rounded-full object-cover border"
                    width={40}
                    height={40}
                  />
                </TableCell>
                <TableCell className="font-medium">{critter.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {typeLabels[critter.type] || critter.type}
                  </span>
                </TableCell>
                <TableCell>{critter.baseHp}</TableCell>
                <TableCell>{critter.baseAttack}</TableCell>
                <TableCell>{critter.baseDefense}</TableCell>
                <TableCell>{critter.hpGrowth}</TableCell>
                <TableCell>{critter.attackGrowth}</TableCell>
                <TableCell>{critter.defenseGrowth}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(critter)}
                    >
                      수정
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(critter.id)}
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
          새 크리터 추가
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedCritter ? '크리터 수정' : '새 크리터 추가'}</DialogTitle>
            <DialogDescription>
              {selectedCritter ? '이 크리터의 정보를 수정합니다.' : '새로운 크리터를 추가합니다.'}
            </DialogDescription>
          </DialogHeader>
          <CritterForm initialData={selectedCritter} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 