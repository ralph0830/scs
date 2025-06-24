import { ICritter } from '@/types'
import AvailableCritterCard from './AvailableCritterCard'

interface IAvailableCritterListProps {
  critters: ICritter[]
  onAddCritter: (critter: ICritter) => void
  party: (ICritter | null)[]
}

const AvailableCritterList = ({ critters, onAddCritter, party }: IAvailableCritterListProps) => {
  const partyCritterIds = new Set(party.map(c => c?.id).filter(Boolean));

  return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" data-testid="available-critter-list">
        <h2 className="text-xl font-bold mb-4 text-center">사용 가능한 크리터</h2>
        <div 
            className="grid grid-cols-5 gap-3"
        >
        {critters.map(critter => (
          <AvailableCritterCard 
            key={critter.id} 
            critter={critter} 
            onAddCritter={onAddCritter}
            isAdded={partyCritterIds.has(critter.id)}
          />
        ))}
        </div>
    </div>
  )
}

export default AvailableCritterList 