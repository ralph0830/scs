'use client'

import { useDroppable } from '@dnd-kit/core'
import { ICritter } from '@/types'
import PartyCritter from './PartyCritter'
import { cn } from '@/lib/utils'

interface IPartySlotProps {
  id: string
  critter: ICritter | null
  index: number
  onRemove: (index: number) => void
}

export default function PartySlot({ id, critter, index, onRemove }: IPartySlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${id}`,
    data: { index },
  })

  const baseClasses =
    'border-2 border-dashed rounded-lg transition-colors flex items-center justify-center p-2 h-28'
  const stateClasses = isOver
    ? 'border-blue-500 bg-blue-100'
    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'

  return (
    <div ref={setNodeRef} className={cn(baseClasses, stateClasses)} data-testid={`party-slot-${id}`}>
      {critter ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <PartyCritter critter={critter} positionIndex={index} />
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-20"
            data-testid={`remove-critter-${critter.id}`}
          >
            X
          </button>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">Empty</span>
      )}
    </div>
  )
}