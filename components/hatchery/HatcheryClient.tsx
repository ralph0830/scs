'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

type NewCritter = {
  id: number;
  critterId: number;
  name: string;
}

interface Egg {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  count: number;
}

interface HatcheryClientProps {
  initialEggs: Egg[];
}

export default function HatcheryClient({ initialEggs }: HatcheryClientProps) {
  const [eggs, setEggs] = useState(initialEggs);
  const [isLoading, setIsLoading] = useState(false)
  const [lastHatchedCritter, setLastHatchedCritter] = useState<NewCritter | null>(null)
  const { toast } = useToast()

  const handleHatch = async () => {
    setIsLoading(true)
    setLastHatchedCritter(null)
    try {
      const response = await fetch('/api/hatchery/hatch', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        setLastHatchedCritter(result.critter)
        
        // Optimistically update egg count
        const eggToUpdate = eggs.find(e => e.name === "Egg");
        if (eggToUpdate && eggToUpdate.count > 0) {
          const updatedEggs = eggs.map(e => e.id === eggToUpdate.id ? {...e, count: e.count -1} : e);
          setEggs(updatedEggs.filter(e => e.count > 0));
        }

        toast({
          title: '부화 성공!',
          description: `${result.critter.name}이(가) 부화했습니다!`,
        })
      } else {
        const error = await response.json()
        toast({
          title: '부화 실패',
          description: error.message || '부화 중 오류가 발생했습니다.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '부화 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const hasEggs = eggs.some(e => e.name === 'Egg' && e.count > 0);
  const eggCount = eggs.find(e => e.name === 'Egg')?.count ?? 0;

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-8rem)] overflow-y-auto">
       <div className="text-center mb-8">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
           부화장
         </h1>
         <p className="text-lg text-gray-600 dark:text-gray-300">
           알을 부화시켜 새로운 크리터를 만나보세요!
         </p>
       </div>

      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">알 부화시키기</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          현재 보유한 알: {eggCount}개
        </p>
        <div className="text-center">
          <Button
            onClick={handleHatch}
            disabled={isLoading || !hasEggs}
            className="w-full"
            size="lg"
          >
            {isLoading ? '부화 중...' : (hasEggs ? '부화하기 (100 골드)' : '알이 없습니다')}
          </Button>
        </div>
      </div>

      {lastHatchedCritter && (
         <div className="mt-8 mx-auto w-full max-w-sm rounded-lg border bg-secondary p-6 text-center">
            <h2 className="text-2xl font-semibold">새로운 친구!</h2>
            <p className="mt-2">{lastHatchedCritter.name}를 획득했습니다!</p>
            <p className="mt-1 text-sm text-muted-foreground">(도감에서 자세한 정보를 확인할 수 있습니다)</p>
             <Link href={`/critterdex/${lastHatchedCritter.critterId}`} passHref>
                <Button variant="link" className="mt-2">자세히 보기</Button>
            </Link>
         </div>
      )}
    </div>
  )
} 