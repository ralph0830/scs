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
import { ICritter } from '@/types'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/ui/ImageUpload'

const ALL_CRITTER_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying',
  'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
] as const;

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  type: z.enum(ALL_CRITTER_TYPES),
  imageUrl: z.string().optional(),
  baseHp: z.coerce.number().int().min(1),
  baseAttack: z.coerce.number().int().min(1),
  baseDefense: z.coerce.number().int().min(1),
  hpGrowth: z.coerce.number().min(1),
  attackGrowth: z.coerce.number().min(1),
  defenseGrowth: z.coerce.number().min(1),
})

type CritterFormValues = z.infer<typeof formSchema>

interface CritterFormProps {
  initialData?: ICritter | null
  onSuccess: (critter: ICritter) => void
}

export const CritterForm = ({ initialData, onSuccess }: CritterFormProps) => {
  const isEditMode = !!initialData

  const form = useForm<CritterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description ?? '',
          imageUrl: initialData.imageUrl ?? '',
        }
      : {
          name: '',
          description: '',
          type: 'normal',
          imageUrl: '/critters/no-image.png',
          baseHp: 10,
          baseAttack: 5,
          baseDefense: 5,
          hpGrowth: 1.1,
          attackGrowth: 1.1,
          defenseGrowth: 1.1,
        },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: CritterFormValues) => {
    try {
      if (isEditMode && !initialData) {
        toast.error('Critter data is missing for an update.');
        return;
      }

      const url = isEditMode
        ? `/api/critters/${initialData.id}`
        : '/api/critters'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Something went wrong')
      }

      const savedCritter = await response.json();

      toast.success(
        `Critter ${isEditMode ? 'updated' : 'created'} successfully!`
      )
      onSuccess(savedCritter)
    } catch (error) {
      toast.error('Failed to save critter.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Fields... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Aquapin" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_CRITTER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="A mysterious water critter" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <h3 className="text-lg font-medium pt-4 border-t">Base Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="baseHp" render={({ field }) => (
            <FormItem>
              <FormLabel>Base HP</FormLabel>
              <FormControl><Input type="number" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="baseAttack" render={({ field }) => (
            <FormItem>
              <FormLabel>Base Attack</FormLabel>
              <FormControl><Input type="number" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="baseDefense" render={({ field }) => (
            <FormItem>
              <FormLabel>Base Defense</FormLabel>
              <FormControl><Input type="number" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <h3 className="text-lg font-medium pt-4 border-t">Stat Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="hpGrowth" render={({ field }) => (
            <FormItem>
              <FormLabel>HP Growth</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="attackGrowth" render={({ field }) => (
            <FormItem>
              <FormLabel>Attack Growth</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="defenseGrowth" render={({ field }) => (
            <FormItem>
              <FormLabel>Defense Growth</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} disabled={isSubmitting} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  )
} 