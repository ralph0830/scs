'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

interface IItem {
  id: number
  name: string
  description: string
  type: string
  rarity: string
  imageUrl: string | null
  effect: string
  price: number | null
  howGet?: string
  sellPrice?: string
  feedPower?: string
  combine?: string
  dropMonsters?: string
}

export default function AdminItemsPage() {
  const [items, setItems] = useState<IItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<IItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "아이템 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      rarity: formData.get('rarity') as string,
      effect: formData.get('effect') as string,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      imageUrl: formData.get('imageUrl') as string,
    }

    try {
      const url = editingItem ? `/api/admin/items/${editingItem.id}` : '/api/admin/items'
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        toast({
          title: "성공",
          description: editingItem ? "아이템이 수정되었습니다." : "아이템이 추가되었습니다.",
        })
        setIsDialogOpen(false)
        setEditingItem(null)
        fetchItems()
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "아이템 저장에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 아이템을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/items/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({
          title: "성공",
          description: "아이템이 삭제되었습니다.",
        })
        fetchItems()
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "아이템 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: IItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="p-6">로딩 중...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">아이템 관리</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>아이템 추가</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? '아이템 수정' : '아이템 추가'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                />
              </div>
              <div>
                <Label htmlFor="type">타입</Label>
                <Select name="type" defaultValue={editingItem?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일반재료">일반재료</SelectItem>
                    <SelectItem value="가공재료">가공재료</SelectItem>
                    <SelectItem value="음식">음식</SelectItem>
                    <SelectItem value="알">알</SelectItem>
                    <SelectItem value="장비">장비</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rarity">등급</Label>
                <Select name="rarity" defaultValue={editingItem?.rarity}>
                  <SelectTrigger>
                    <SelectValue placeholder="등급 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">일반</SelectItem>
                    <SelectItem value="uncommon">고급</SelectItem>
                    <SelectItem value="rare">희귀</SelectItem>
                    <SelectItem value="epic">영웅</SelectItem>
                    <SelectItem value="legendary">전설</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="effect">효과</Label>
                <Input
                  id="effect"
                  name="effect"
                  defaultValue={editingItem?.effect}
                />
              </div>
              <div>
                <Label htmlFor="price">가격</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingItem?.price || ''}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">이미지 경로</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingItem?.imageUrl || ''}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">
                  {editingItem ? '수정' : '추가'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>이미지</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>등급</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.rarity}</TableCell>
                <TableCell>{item.price || '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(item)}
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 