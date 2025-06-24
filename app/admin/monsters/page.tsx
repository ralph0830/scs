'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { IMonster, MonsterRarity, CritterType } from '@/types';

const critterTypes: CritterType[] = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'];
const rarityOptions: MonsterRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const rarityLabels: Record<MonsterRarity, string> = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  epic: '에픽',
  legendary: '전설',
};

const typeLabels: Record<CritterType, string> = {
  normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', dark: '악', fairy: '페어리',
};

export default function MonsterManagementPage() {
  const [monsters, setMonsters] = useState<IMonster[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState<IMonster | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '',
    imageUrl: '',
    type: 'normal' as CritterType,
    baseHp: 10,
    baseAttack: 5,
    baseDefense: 5,
    hpGrowth: 1.1,
    attackGrowth: 1.1,
    defenseGrowth: 1.1,
    rarity: 'common' as MonsterRarity,
    minLevel: 1,
    maxLevel: 100,
    experienceReward: 10,
    goldReward: 5,
    dropRate: 0.1,
  });

  useEffect(() => {
    fetchMonsters();
  }, []);

  const fetchMonsters = async () => {
    try {
      const response = await fetch('/api/admin/monsters');
      if (response.ok) {
        const data = await response.json();
        setMonsters(data);
      }
    } catch (error) {
      console.error('Error fetching monsters:', error);
      toast({
        title: '오류',
        description: '몬스터 목록을 불러오지 못했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (isEdit: boolean = false) => {
    try {
      const url = isEdit ? `/api/admin/monsters/${editingMonster?.id}` : '/api/admin/monsters';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: '성공',
          description: isEdit ? '몬스터가 수정되었습니다.' : '몬스터가 추가되었습니다.',
        });
        fetchMonsters();
        resetForm();
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
      } else {
        throw new Error('Failed to save monster');
      }
    } catch (error) {
      console.error('Error saving monster:', error);
      toast({
        title: '오류',
        description: '몬스터 저장에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (monsterId: number) => {
    try {
      const response = await fetch(`/api/admin/monsters/${monsterId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: '성공',
          description: '몬스터가 삭제되었습니다.',
        });
        fetchMonsters();
      } else {
        throw new Error('Failed to delete monster');
      }
    } catch (error) {
      console.error('Error deleting monster:', error);
      toast({
        title: '오류',
        description: '몬스터 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (monster: IMonster) => {
    setEditingMonster(monster);
    setFormData({
      name: monster.name,
      description: monster.description || '',
      emoji: monster.emoji || '',
      imageUrl: monster.imageUrl || '',
      type: monster.type,
      baseHp: monster.baseHp,
      baseAttack: monster.baseAttack,
      baseDefense: monster.baseDefense,
      hpGrowth: monster.hpGrowth,
      attackGrowth: monster.attackGrowth,
      defenseGrowth: monster.defenseGrowth,
      rarity: monster.rarity,
      minLevel: monster.minLevel,
      maxLevel: monster.maxLevel,
      experienceReward: monster.experienceReward,
      goldReward: monster.goldReward,
      dropRate: monster.dropRate,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      emoji: '',
      imageUrl: '',
      type: 'normal',
      baseHp: 10,
      baseAttack: 5,
      baseDefense: 5,
      hpGrowth: 1.1,
      attackGrowth: 1.1,
      defenseGrowth: 1.1,
      rarity: 'common',
      minLevel: 1,
      maxLevel: 100,
      experienceReward: 10,
      goldReward: 5,
      dropRate: 0.1,
    });
    setEditingMonster(null);
  };

  const getRarityColor = (rarity: MonsterRarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">몬스터 관리</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>새 몬스터 추가</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 몬스터 추가</DialogTitle>
            </DialogHeader>
            <MonsterForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={() => handleSubmit(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>이름</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>희귀도</TableHead>
              <TableHead>레벨 범위</TableHead>
              <TableHead>기본 HP</TableHead>
              <TableHead>기본 공격</TableHead>
              <TableHead>기본 방어</TableHead>
              <TableHead>경험치 보상</TableHead>
              <TableHead>골드 보상</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monsters.map((monster) => (
              <TableRow key={monster.id}>
                <TableCell>
                  <img
                    src={monster.imageUrl && monster.imageUrl.trim() !== '' ? monster.imageUrl : '/critters/no-image.png'}
                    alt={monster.name + ' 이미지'}
                    className="w-10 h-10 rounded-full object-cover border"
                    width={40}
                    height={40}
                  />
                </TableCell>
                <TableCell className="font-medium">{monster.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {typeLabels[monster.type]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${getRarityColor(monster.rarity)}`}>
                    {rarityLabels[monster.rarity]}
                  </span>
                </TableCell>
                <TableCell>{monster.minLevel} - {monster.maxLevel}</TableCell>
                <TableCell>{monster.baseHp}</TableCell>
                <TableCell>{monster.baseAttack}</TableCell>
                <TableCell>{monster.baseDefense}</TableCell>
                <TableCell>{monster.experienceReward}</TableCell>
                <TableCell>{monster.goldReward}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(monster)}>
                      수정
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">삭제</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다. 이 몬스터를 영구적으로 삭제합니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(monster.id)}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>몬스터 수정</DialogTitle>
          </DialogHeader>
          <MonsterForm 
            formData={formData} 
            setFormData={setFormData} 
            onSubmit={() => handleSubmit(true)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MonsterForm({ formData, setFormData, onSubmit }: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
}) {
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
        <Label htmlFor="emoji">이모지</Label>
        <Input
          id="emoji"
          value={formData.emoji}
          onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
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
        <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
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

      <div>
        <Label htmlFor="rarity">희귀도</Label>
        <Select value={formData.rarity} onValueChange={(value: string) => setFormData({ ...formData, rarity: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rarityOptions.map((rarity) => (
              <SelectItem key={rarity} value={rarity}>
                {rarityLabels[rarity]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minLevel">최소 레벨</Label>
          <Input
            id="minLevel"
            type="number"
            value={formData.minLevel}
            onChange={(e) => setFormData({ ...formData, minLevel: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxLevel">최대 레벨</Label>
          <Input
            id="maxLevel"
            type="number"
            value={formData.maxLevel}
            onChange={(e) => setFormData({ ...formData, maxLevel: parseInt(e.target.value) })}
            required
          />
        </div>
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
        <div>
          <Label htmlFor="dropRate">드롭률</Label>
          <Input
            id="dropRate"
            type="number"
            step="0.01"
            value={formData.dropRate}
            onChange={(e) => setFormData({ ...formData, dropRate: parseFloat(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSubmit}>저장</Button>
      </div>
    </div>
  );
} 