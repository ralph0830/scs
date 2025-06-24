'use client'

import { useDraggable } from '@dnd-kit/core'
import CritterCard from '../CritterCard'
import { ICritter } from '@/types'

interface IDraggableCritterCardProps {
  critter: ICritter
}

const DraggableCritterCard = ({ critter }: IDraggableCritterCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `critter-${critter.id}`,
    data: { critter, fromParty: false },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CritterCard critter={critter} />
    </div>
  )
}

export default DraggableCritterCard 