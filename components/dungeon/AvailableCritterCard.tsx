'use client'

import { useDraggable } from '@dnd-kit/core'
import { ICritter } from '@/types'
import Image from 'next/image'

interface IAvailableCritterCardProps {
  critter: ICritter
  onAddCritter: (critter: ICritter) => void
  isAdded: boolean
}

const AvailableCritterCard = ({ critter, onAddCritter, isAdded }: IAvailableCritterCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-critter-${critter.id}`,
    data: { critter, fromParty: false },
    disabled: isAdded
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined

  const handleClick = () => {
    if (isAdded) return
    onAddCritter(critter)
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
        isAdded
          ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600'
          : 'cursor-pointer bg-gray-100 dark:bg-gray-800 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      data-testid={`critter-${critter.id}`}
    >
      <div className="w-16 h-16 relative">
        {critter.imageUrl ? (
          <Image 
            src={critter.imageUrl} 
            alt={critter.name} 
            fill 
            sizes="64px"
            style={{ objectFit: 'contain' }} 
          />
        ) : (
          <span className="text-4xl">🐾</span>
        )}
      </div>
      <p className="text-sm font-bold mt-1">{critter.name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">공격: {critter.baseAttack} 방어: {critter.baseDefense}</p>
    </div>
  )
}

export default AvailableCritterCard 