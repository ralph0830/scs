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
import { IMonster } from '@/types'
import { toast } from 'sonner'

const formSchema = z.object({
  monsterId: z.coerce.number().int().min(1, { message: '몬스터를 선택해주세요.' }),
  spawnRate: z.coerce.number().min(0.01, { message: '스폰률은 0.01 이상이어야 합니다.' }).max(1, { message: '스폰률은 1 이하여야 합니다.' }),
  minLevel: z.coerce.number().int().min(1, { message: '최소 레벨은 1 이상이어야 합니다.' }),
  maxLevel: z.coerce.number().int().min(1, { message: '최대 레벨은 1 이상이어야 합니다.' }),
  isBoss: z.boolean(),
  bossSpawnCondition: z.string().optional(),
}).refine((data) => data.minLevel <= data.maxLevel, {
  message: "최소 레벨은 최대 레벨보다 작거나 같아야 합니다.",
  path: ["minLevel"],
});

type MonsterSpawnFormValues = z.infer<typeof formSchema>

interface MonsterSpawn {
  id: number
  dungeonId: number
  monsterId: number
  spawnRate: number
  minLevel: number
  maxLevel: number
  isBoss: boolean
  bossSpawnCondition?: string
  monster: IMonster
}

interface MonsterSpawnFormProps {
  initialData?: MonsterSpawn | null
  onSuccess: () => void
  dungeonId: number
  monsters: IMonster[]
}

export const MonsterSpawnForm = ({ initialData, onSuccess, dungeonId, monsters }: MonsterSpawnFormProps) => {
  const isEditMode = !!initialData

  const form = useForm<MonsterSpawnFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          monsterId: initialData.monsterId,
          spawnRate: initialData.spawnRate,
          minLevel: initialData.minLevel,
          maxLevel: initialData.maxLevel,
          isBoss: initialData.isBoss,
          bossSpawnCondition: initialData.bossSpawnCondition ?? '',
        }
      : {
          monsterId: 0,
          spawnRate: 0.15,
          minLevel: 1,
          maxLevel: 20,
          isBoss: false,
          bossSpawnCondition: '',
        },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: MonsterSpawnFormValues) => {
    try {
      if (isEditMode && !initialData) {
        toast.error('몬스터 스폰 데이터가 누락되었습니다.');
        return;
      }

      const url = isEditMode
        ? `/api/admin/dungeons/${dungeonId}/spawns/${initialData.id}`
        : `/api/admin/dungeons/${dungeonId}/spawns`
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
        `몬스터 스폰이 ${isEditMode ? '수정' : '추가'}되었습니다!`
      )
      onSuccess()
    } catch (error) {
      toast.error('몬스터 스폰 저장에 실패했습니다.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="monsterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>몬스터</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="몬스터를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {monsters.map((monster) => (
                    <SelectItem key={monster.id} value={monster.id.toString()}>
                      <div className="flex items-center">
                        {monster.emoji && <span className="mr-2">{monster.emoji}</span>}
                        {monster.name}
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
            name="spawnRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>스폰률 (0.01 ~ 1.0)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0.01" 
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
            name="isBoss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>보스 여부</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value.toString()} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="false">일반 몬스터</SelectItem>
                    <SelectItem value="true">보스 몬스터</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="bossSpawnCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>보스 스폰 조건 (JSON)</FormLabel>
              <FormControl>
                <Input 
                  placeholder='{"distance": 800, "chance": 0.1}' 
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