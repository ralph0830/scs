import { ICritter } from '@/types';
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ICritterCardProps {
  critter: ICritter;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const typeLabels: Record<string, string> = {
  normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', dark: '악', fairy: '페어리',
}

const CritterCard = ({ critter, onEdit, onDelete, showActions = false }: ICritterCardProps) => {
  const cardContent = (
    <div
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center h-full"
    >
      <div className="w-24 h-24 relative mb-2">
        {critter.imageUrl ? (
          <Image
            src={critter.imageUrl}
            alt={critter.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
            priority
          />
        ) : (
          <span className="text-6xl flex items-center justify-center w-full h-full">🐾</span>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold">{critter.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{critter.description}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {typeLabels[critter.type] || critter.type}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <span className="text-gray-500">HP:</span>
          <span className="ml-1 font-medium">{critter.baseHp}</span>
        </div>
        <div>
          <span className="text-gray-500">공격:</span>
          <span className="ml-1 font-medium">{critter.baseAttack}</span>
        </div>
        <div>
          <span className="text-gray-500">방어:</span>
          <span className="ml-1 font-medium">{critter.baseDefense}</span>
        </div>
      </div>
      {showActions && (
        <div className="mt-4 flex space-x-2">
          {onEdit && (
            <Button onClick={onEdit} size="sm" variant="outline">
              수정
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} size="sm" variant="destructive">
              삭제
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // 관리자 모드에서는 링크 없이 렌더링
  if (showActions) {
    return cardContent;
  }

  // 일반 모드에서는 링크로 감싸서 렌더링
  return (
    <Link href={`/critterdex/${critter.id}`} passHref>
      {cardContent}
    </Link>
  );
}

export default CritterCard; 