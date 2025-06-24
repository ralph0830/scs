"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ICritter } from '@/types'
import CritterCard from './CritterCard'
import DraggableCritterCard from "./dungeon/DraggableCritterCard"

interface CritterListProps {
  showActions?: boolean
  onEdit?: (critter: ICritter) => void
  initialCritters?: ICritter[]
}

export default function CritterList({ showActions = false, onEdit, initialCritters }: CritterListProps) {
  const [critters, setCritters] = useState<ICritter[]>(initialCritters || [])
  const [isLoading, setIsLoading] = useState(!initialCritters)
  const { toast } = useToast()

  useEffect(() => {
    if (!initialCritters) {
      fetchCritters()
    }
  }, [initialCritters])

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
    } finally {
      setIsLoading(false)
    }
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

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (critters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">등록된 크리터가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="show-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg min-h-24 overflow-y-auto">
      {critters.map((critter) => (
        showActions ? (
          <DraggableCritterCard key={critter.id} critter={critter} />
        ) : (
          <CritterCard
            key={critter.id}
            critter={critter}
            showActions={showActions}
            onEdit={onEdit ? () => onEdit(critter) : undefined}
            onDelete={showActions ? () => handleDelete(critter.id) : undefined}
          />
        )
      ))}
    </div>
  )
} 