import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const critterTypes = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying',
  'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy',
  '근접, 물리', '원거리, 물리', '원거리, 마법'
];
const rarityOptions = [
  'common', 'uncommon', 'rare', 'epic', 'legendary', '미지정'
];
const typeLabels: Record<string, string> = {
  'normal': '노말', 'fire': '불꽃', 'water': '물', 'grass': '풀', 'electric': '전기', 'ice': '얼음', 'fighting': '격투', 'poison': '독', 'ground': '땅', 'flying': '비행', 'psychic': '에스퍼', 'bug': '벌레', 'rock': '바위', 'ghost': '고스트', 'dragon': '드래곤', 'steel': '강철', 'dark': '악', 'fairy': '페어리',
  '근접, 물리': '노말', '원거리, 물리': '노말', '원거리, 마법': '에스퍼',
};
const rarityLabels: Record<string, string> = {
  'common': '일반', 'uncommon': '고급', 'rare': '희귀', 'epic': '에픽', 'legendary': '전설', '미지정': '미지정',
};

export function MonsterForm({ formData, setFormData, onSubmit, isEdit, isSubmitting }: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isEdit: boolean;
  isSubmitting: boolean;
}) {
  const getMonsterImageUrl = (url: string | null | undefined) => {
    if (!url) return '/critters/no-image.png';
    if (url.startsWith('/images/')) return url.replace('/images/', '/monsters/');
    return url;
  };

  return (
    <div className="space-y-4">
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
        <Select value={formData.type || ''} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="타입 선택" />
          </SelectTrigger>
          <SelectContent>
            {critterTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {typeLabels[type] || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="rarity">희귀도</Label>
        <Select value={formData.rarity || ''} onValueChange={(value: string) => setFormData({ ...formData, rarity: value })}>
          <SelectTrigger>
            <SelectValue placeholder="희귀도 선택" />
          </SelectTrigger>
          <SelectContent>
            {rarityOptions.map((rarity) => (
              <SelectItem key={rarity} value={rarity}>
                {rarityLabels[rarity] || rarity}
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
          <Label htmlFor="experienceReward">경험치 보상</Label>
          <Input
            id="experienceReward"
            type="number"
            value={formData.experienceReward}
            onChange={(e) => setFormData({ ...formData, experienceReward: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="goldReward">골드 보상</Label>
          <Input
            id="goldReward"
            type="number"
            value={formData.goldReward}
            onChange={(e) => setFormData({ ...formData, goldReward: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={isSubmitting}>{isEdit ? '수정' : '저장'}</Button>
      </div>
    </div>
  );
} 