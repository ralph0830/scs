'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ICritter } from '@/types'

const typeLabels: Record<string, string> = {
  normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', dark: '악', fairy: '페어리',
}

export default function CritterDetailPage() {
  const params = useParams()
  const [critter, setCritter] = useState<ICritter | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCritter = async () => {
      try {
        const response = await fetch(`/api/critters/${params.critterId}`)
        if (response.ok) {
          const data = await response.json()
          setCritter(data)
        } else {
          console.error('크리터를 찾을 수 없습니다.')
        }
      } catch (error) {
        console.error('크리터 정보를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.critterId) {
      fetchCritter()
    }
  }, [params.critterId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  if (!critter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            크리터를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            요청하신 크리터가 존재하지 않습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-32 h-32">
              <Image
                src={critter.imageUrl || '/critters/aquapin.png'}
                alt={critter.name}
                fill
                sizes="128px"
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {critter.name}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {typeLabels[critter.type] || critter.type}
                </span>
              </div>
            </div>
          </div>

          {critter.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                설명
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {critter.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                기본 HP
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {critter.baseHp}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                기본 공격력
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {critter.baseAttack}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                기본 방어력
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {critter.baseDefense}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                HP 성장률
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {critter.hpGrowth}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                공격 성장률
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {critter.attackGrowth}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                방어 성장률
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {critter.defenseGrowth}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => window.history.back()}>
              뒤로 가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 