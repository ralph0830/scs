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
import { MonsterForm } from '@/components/admin/MonsterForm';

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

// 이미지 경로 변환 함수 추가
const getMonsterImageUrl = (url: string | null | undefined) => {
  if (!url) return '/critters/no-image.png';
  if (url.startsWith('/images/')) return url.replace('/images/', '/monsters/');
  return url;
};

export default function MonsterManagementPage() {
  const [monsters, setMonsters] = useState<IMonster[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState<IMonster | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: undefined,
    name: '',
    description: '',
    imageUrl: '',
    type: 'normal' as CritterType,
    baseHp: 10,
    baseAttack: 5,
    baseDefense: 5,
    rarity: 'common' as MonsterRarity,
    experienceReward: 10,
    goldReward: 5,
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
      id: monster.id,
      name: monster.name,
      description: monster.description || '',
      imageUrl: monster.imageUrl || '',
      type: monster.type,
      baseHp: monster.baseHp,
      baseAttack: monster.baseAttack,
      baseDefense: monster.baseDefense,
      rarity: monster.rarity,
      experienceReward: monster.experienceReward,
      goldReward: monster.goldReward,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: undefined,
      name: '',
      description: '',
      imageUrl: '',
      type: 'normal',
      baseHp: 10,
      baseAttack: 5,
      baseDefense: 5,
      rarity: 'common',
      experienceReward: 10,
      goldReward: 5,
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

  const getTypeLabel = (type: string | null | undefined) => {
    if (!type) return '미지정';
    const map: Record<string, string> = {
      'normal': '노말', 'fire': '불꽃', 'water': '물', 'grass': '풀', 'electric': '전기', 'ice': '얼음', 'fighting': '격투', 'poison': '독', 'ground': '땅', 'flying': '비행', 'psychic': '에스퍼', 'bug': '벌레', 'rock': '바위', 'ghost': '고스트', 'dragon': '드래곤', 'steel': '강철', 'dark': '악', 'fairy': '페어리',
      '근접, 물리': '노말', '원거리, 물리': '노말', '원거리, 마법': '에스퍼', // DB legacy 값 매핑
    };
    return map[type] || type;
  };

  const getRarityLabel = (rarity: string | null | undefined) => {
    if (!rarity) return '미지정';
    const map: Record<string, string> = {
      'common': '일반', 'uncommon': '고급', 'rare': '희귀', 'epic': '에픽', 'legendary': '전설',
    };
    return map[rarity] || rarity;
  };

  return (
    <div className="bg-[#222] text-gray-100 min-h-screen">
      <main className="px-2 py-4 bg-[#222] min-h-screen">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          <div className="bg-[#333] border border-[#444] rounded-xl p-4 shadow mb-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">몬스터 관리</h1>
              <Button onClick={() => setIsAddDialogOpen(true)}>몬스터 추가</Button>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <Table className="bg-[#333] text-gray-100">
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>희귀도</TableHead>
                    <TableHead>기본 HP</TableHead>
                    <TableHead>기본 공격</TableHead>
                    <TableHead>기본 방어</TableHead>
                    <TableHead>경험치 보상</TableHead>
                    <TableHead>골드 보상</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monsters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center">등록된 몬스터가 없습니다.</TableCell>
                    </TableRow>
                  ) : (
                    monsters.map((monster) => (
                      <TableRow key={monster.id}>
                        <TableCell>
                          <img
                            src={getMonsterImageUrl(monster.imageUrl)}
                            alt={monster.name + ' 이미지'}
                            className="w-10 h-10 rounded-full object-cover border"
                            width={40}
                            height={40}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{monster.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {getTypeLabel(monster.type)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm ${getRarityColor(monster.rarity)}`}>
                            {getRarityLabel(monster.rarity)}
                          </span>
                        </TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#333] text-gray-100 border-[#444]">새 몬스터 추가</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#333] text-gray-100 border-[#444]">
            <MonsterForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={() => handleSubmit(false)}
              isEdit={false}
              isSubmitting={false}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#333] text-gray-100 border-[#444]">
            <MonsterForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={() => handleSubmit(true)}
              isEdit={true}
              isSubmitting={false}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}