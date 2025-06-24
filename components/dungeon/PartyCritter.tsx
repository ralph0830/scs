'use client'

import { useDraggable } from '@dnd-kit/core'
import { ICritter } from '@/types'
import Image from 'next/image'

interface IPartyCritterProps {
  critter: ICritter
  positionIndex: number
}

export default function PartyCritter({ critter, positionIndex }: IPartyCritterProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `party-critter-${critter.id}`,
    data: { critter, fromParty: true, fromIndex: positionIndex },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center cursor-grab"
      data-testid={`party-critter-${critter.id}`}
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
      <p className="text-xs font-semibold mt-1 truncate">{critter.name}</p>
    </div>
  )
} 