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
  imageUrl: string | null
  type: string
  sellPrice: number | null
  gemPrice?: string | null
  feedPower?: string | null
  importantVal?: string | null
  stats?: string | null
  statsEng?: string | null
  equipmentType?: string | null
}

const ITEM_TYPES = [
  { value: '10', text: '일반재료' },
  { value: '11', text: '가공재료' },
  { value: '12', text: '특수재료' },
  { value: '20', text: '음식' },
  { value: '21', text: '음식(상점)' },
  { value: '31', text: '검' },
  { value: '32', text: '단검' },
  { value: '33', text: '지팡이' },
  { value: '34', text: '활' },
  { value: '35', text: '헤비아머' },
  { value: '36', text: '미디엄아머' },
  { value: '37', text: '라이트아머' },
  { value: '38', text: '액세서리' },
  { value: '40', text: '알' },
  { value: '60', text: '포션' },
]

const EQUIPMENT_TYPE_LABELS = {
  weapon: '무기',
  armor: '방어구',
  accessory: '액세서리',
}

const EQUIPMENT_TYPE_OPTIONS = [
  { value: 'weapon', text: '무기' },
  { value: 'armor', text: '방어구' },
  { value: 'accessory', text: '액세서리' },
]

function getImageUrl(imageUrl: string | null) {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('/items/')) return imageUrl
  if (imageUrl.startsWith('items/')) return '/' + imageUrl
  return '/items/' + imageUrl.replace(/^\//, '')
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
    const rawImageUrl = formData.get('imageUrl') as string
    const imageUrl = getImageUrl(rawImageUrl)
    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      imageUrl,
      sellPrice: formData.get('sellPrice') ? Number(formData.get('sellPrice')) : null,
      gemPrice: formData.get('gemPrice') as string,
      feedPower: formData.get('feedPower') as string,
      importantVal: formData.get('importantVal') as string,
      stats: formData.get('stats') as string,
      statsEng: formData.get('statsEng') as string,
      equipmentType: formData.get('equipmentType') as string,
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
    <div className="bg-[#222] text-gray-100 min-h-screen">
      <main className="px-2 py-4 bg-[#222] min-h-screen">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          <div className="bg-[#333] border border-[#444] rounded-xl p-4 shadow mb-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">아이템 관리</h1>
              <Button onClick={openAddDialog}>아이템 추가</Button>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <Table className="bg-[#333] text-gray-100">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>이미지</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>판매가</TableHead>
                    <TableHead>보석가</TableHead>
                    <TableHead>영양력</TableHead>
                    <TableHead>중요도</TableHead>
                    <TableHead>장비유형</TableHead>
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
                            src={getImageUrl(item.imageUrl)}
                            alt={item.name}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{ITEM_TYPES.find(t => t.value === item.type)?.text}</TableCell>
                      <TableCell>{item.sellPrice || '-'}</TableCell>
                      <TableCell>{item.gemPrice || '-'}</TableCell>
                      <TableCell>{item.feedPower || '-'}</TableCell>
                      <TableCell>{item.importantVal || '-'}</TableCell>
                      <TableCell>{item.equipmentType && EQUIPMENT_TYPE_LABELS[item.equipmentType as keyof typeof EQUIPMENT_TYPE_LABELS] ? EQUIPMENT_TYPE_LABELS[item.equipmentType as keyof typeof EQUIPMENT_TYPE_LABELS] : '-'}</TableCell>
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
                            disabled={true}
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
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>아이템 추가</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#333] text-gray-100 border-[#444]">
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
                    {ITEM_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imageUrl">이미지 경로</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingItem?.imageUrl || ''}
                />
              </div>
              <div>
                <Label htmlFor="sellPrice">판매가</Label>
                <Input
                  id="sellPrice"
                  name="sellPrice"
                  type="number"
                  defaultValue={editingItem?.sellPrice || ''}
                />
              </div>
              <div>
                <Label htmlFor="gemPrice">보석가</Label>
                <Input
                  id="gemPrice"
                  name="gemPrice"
                  defaultValue={editingItem?.gemPrice || ''}
                />
              </div>
              <div>
                <Label htmlFor="feedPower">영양력</Label>
                <Input
                  id="feedPower"
                  name="feedPower"
                  defaultValue={editingItem?.feedPower || ''}
                />
              </div>
              <div>
                <Label htmlFor="importantVal">중요도</Label>
                <Input
                  id="importantVal"
                  name="importantVal"
                  defaultValue={editingItem?.importantVal || ''}
                />
              </div>
              <div>
                <Label htmlFor="stats">통계</Label>
                <Input
                  id="stats"
                  name="stats"
                  defaultValue={editingItem?.stats || ''}
                />
              </div>
              <div>
                <Label htmlFor="statsEng">통계(영문)</Label>
                <Input
                  id="statsEng"
                  name="statsEng"
                  defaultValue={editingItem?.statsEng || ''}
                />
              </div>
              <div>
                <Label htmlFor="equipmentType">장비유형</Label>
                <Select name="equipmentType" defaultValue={editingItem?.equipmentType || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="장비유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_TYPE_OPTIONS.map((et) => (
                      <SelectItem key={et.value} value={et.value}>{et.text}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      </main>
    </div>
  )
} 