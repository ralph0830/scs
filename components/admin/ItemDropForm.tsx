'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { IItem } from '@/types'
import { toast } from 'sonner'

const formSchema = z.object({
  itemId: z.coerce.number().int().min(1, { message: '아이템을 선택해주세요.' }),
  dropRate: z.coerce.number().min(0.001, { message: '드롭률은 0.001 이상이어야 합니다.' }).max(1, { message: '드롭률은 1 이하여야 합니다.' }),
  minDistance: z.coerce.number().int().min(0, { message: '최소 거리는 0 이상이어야 합니다.' }),
  maxDistance: z.coerce.number().int().min(0, { message: '최대 거리는 0 이상이어야 합니다.' }).optional(),
}).refine((data) => !data.maxDistance || data.minDistance <= data.maxDistance, {
  message: "최소 거리는 최대 거리보다 작거나 같아야 합니다.",
  path: ["minDistance"],
});

type ItemDropFormValues = z.infer<typeof formSchema>

interface ItemDrop {
  id: number
  dungeonId: number
  itemId: number
  dropRate: number
  minDistance: number
  maxDistance?: number
  item: IItem
}

interface ItemDropFormProps {
  initialData?: ItemDrop | null
  onSuccess: () => void
  dungeonId: number
  items: IItem[]
}

export const ItemDropForm = ({ initialData, onSuccess, dungeonId, items }: ItemDropFormProps) => {
  const isEditMode = !!initialData

  const form = useForm<ItemDropFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          itemId: initialData.itemId,
          dropRate: initialData.dropRate,
          minDistance: initialData.minDistance,
          maxDistance: initialData.maxDistance,
        }
      : {
          itemId: 0,
          dropRate: 0.05,
          minDistance: 0,
          maxDistance: undefined,
        },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: ItemDropFormValues) => {
    try {
      if (isEditMode && !initialData) {
        toast.error('아이템 드롭 데이터가 누락되었습니다.');
        return;
      }

      const url = isEditMode
        ? `/api/admin/dungeons/${dungeonId}/drops/${initialData.id}`
        : `/api/admin/dungeons/${dungeonId}/drops`
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dungeonId,
        }),
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      toast.success(
        `아이템 드롭이 ${isEditMode ? '수정' : '추가'}되었습니다!`
      )
      onSuccess()
    } catch (error) {
      toast.error('아이템 드롭 저장에 실패했습니다.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="itemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>아이템</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="아이템을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <div className="flex items-center">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-6 h-6 mr-2 rounded"
                          />
                        )}
                        {item.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dropRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>드롭률 (0.001 ~ 1.0)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.001" 
                    min="0.001" 
                    max="1" 
                    {...field} 
                    disabled={isSubmitting} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최소 거리 (m)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maxDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>최대 거리 (m, 선택사항)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="비워두면 던전 끝까지" 
                  {...field} 
                  disabled={isSubmitting} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : (isEditMode ? '수정' : '추가')}
          </Button>
        </div>
      </form>
    </Form>
  )
} 