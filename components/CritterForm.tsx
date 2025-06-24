'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ICritter, CritterType } from '@/types'

const critterTypes: CritterType[] = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy']

const typeLabels: Record<CritterType, string> = {
  normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', dark: '악', fairy: '페어리',
}

interface CritterFormProps {
  initialData?: ICritter | null
  onSuccess: () => void
}

export function CritterForm({ initialData, onSuccess }: CritterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    type: 'normal' as CritterType,
    baseHp: 10,
    baseAttack: 5,
    baseDefense: 5,
    hpGrowth: 1.1,
    attackGrowth: 1.1,
    defenseGrowth: 1.1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        type: initialData.type,
        baseHp: initialData.baseHp,
        baseAttack: initialData.baseAttack,
        baseDefense: initialData.baseDefense,
        hpGrowth: initialData.hpGrowth,
        attackGrowth: initialData.attackGrowth,
        defenseGrowth: initialData.defenseGrowth,
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = initialData ? `/api/critters/${initialData.id}` : '/api/critters'
      const method = initialData ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: '성공',
          description: initialData ? '크리터가 수정되었습니다.' : '크리터가 추가되었습니다.',
        })
        onSuccess()
      } else {
        throw new Error('Failed to save critter')
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '크리터 저장에 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">설명</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">이미지 URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="type">타입</Label>
        <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value as CritterType })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {critterTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {typeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="baseHp">기본 HP</Label>
          <Input
            id="baseHp"
            type="number"
            value={formData.baseHp}
            onChange={(e) => setFormData({ ...formData, baseHp: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="baseAttack">기본 공격력</Label>
          <Input
            id="baseAttack"
            type="number"
            value={formData.baseAttack}
            onChange={(e) => setFormData({ ...formData, baseAttack: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="baseDefense">기본 방어력</Label>
          <Input
            id="baseDefense"
            type="number"
            value={formData.baseDefense}
            onChange={(e) => setFormData({ ...formData, baseDefense: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="hpGrowth">HP 성장률</Label>
          <Input
            id="hpGrowth"
            type="number"
            step="0.1"
            value={formData.hpGrowth}
            onChange={(e) => setFormData({ ...formData, hpGrowth: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="attackGrowth">공격 성장률</Label>
          <Input
            id="attackGrowth"
            type="number"
            step="0.1"
            value={formData.attackGrowth}
            onChange={(e) => setFormData({ ...formData, attackGrowth: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="defenseGrowth">방어 성장률</Label>
          <Input
            id="defenseGrowth"
            type="number"
            step="0.1"
            value={formData.defenseGrowth}
            onChange={(e) => setFormData({ ...formData, defenseGrowth: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  )
} 