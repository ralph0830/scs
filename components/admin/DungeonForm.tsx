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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const ALL_DIFFICULTIES = ['easy', 'medium', 'hard', 'expert', 'master'] as const;

const formSchema = z.object({
  name: z.string().min(2, { message: '이름은 최소 2자 이상이어야 합니다.' }),
  description: z.string().optional(),
  difficulty: z.enum(ALL_DIFFICULTIES),
  minLevel: z.coerce.number().int().min(1, { message: '최소 레벨은 1 이상이어야 합니다.' }),
  maxLevel: z.coerce.number().int().min(1, { message: '최대 레벨은 1 이상이어야 합니다.' }),
  unlockRequirement: z.string().optional(),
  backgroundImage: z.string().optional(),
}).refine((data) => data.minLevel <= data.maxLevel, {
  message: "최소 레벨은 최대 레벨보다 작거나 같아야 합니다.",
  path: ["minLevel"],
});

type DungeonFormValues = z.infer<typeof formSchema>

interface DungeonFormProps {
  initialData?: any | null // Using any for now to avoid type issues during refactor
  onSuccess: () => void
}

export const DungeonForm = ({ initialData, onSuccess }: DungeonFormProps) => {
  const isEditMode = !!initialData

  const form = useForm<DungeonFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? '',
          difficulty: initialData.difficulty,
          minLevel: initialData.minLevel,
          maxLevel: initialData.maxLevel,
          unlockRequirement: initialData.unlockRequirement ?? '',
          backgroundImage: initialData.backgroundImage ?? '',
        }
      : {
          name: '',
          description: '',
          difficulty: 'easy',
          minLevel: 1,
          maxLevel: 10,
          unlockRequirement: '',
          backgroundImage: '',
        },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: DungeonFormValues) => {
    try {
      if (isEditMode && !initialData) {
        toast.error('던전 데이터가 누락되었습니다.');
        return;
      }

      const url = isEditMode
        ? `/api/admin/dungeons/${initialData.id}`
        : '/api/admin/dungeons'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      toast.success(
        `던전이 ${isEditMode ? '수정' : '추가'}되었습니다!`
      )
      onSuccess()
    } catch (error) {
      toast.error('던전 저장에 실패했습니다.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>던전 이름</FormLabel>
                <FormControl>
                  <Input placeholder="D1. 마법의 숲" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>난이도</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="난이도를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">쉬움</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="hard">어려움</SelectItem>
                    <SelectItem value="expert">전문가</SelectItem>
                    <SelectItem value="master">마스터</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="던전에 대한 설명을 입력하세요" 
                  {...field} 
                  disabled={isSubmitting} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최소 레벨</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>최대 레벨</FormLabel>
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
          name="unlockRequirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>해금 조건</FormLabel>
              <FormControl>
                <Input placeholder="예: D1. 마법의 숲 클리어" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>배경 이미지 URL</FormLabel>
              <FormControl>
                <Input placeholder="/images/dungeons/forest.jpg" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isEditMode ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 