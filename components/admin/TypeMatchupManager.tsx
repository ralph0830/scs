'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ITypeMatchup } from '@/types'

const effectivenessToString = (value: number) => {
  if (value === 2) return '효과 증가'
  if (value === 0.5) return '효과 감소'
  if (value === 0) return '효과 없음'
  return '보통'
}

interface TypeMatchupManagerProps {
  initialData: ITypeMatchup[]
}

export default function TypeMatchupManager({ initialData }: TypeMatchupManagerProps) {
  const [typeMatchups, setTypeMatchups] = useState<ITypeMatchup[]>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleEffectivenessChange = (attackingType: string, defendingType: string, effectiveness: number) => {
    setTypeMatchups(prevMatchups =>
      prevMatchups.map(m =>
        m.attackingType === attackingType && m.defendingType === defendingType
          ? { ...m, effectiveness: effectiveness }
          : m
      )
    )
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    const matchupsToSave = typeMatchups.reduce((acc, curr) => {
      acc[`${curr.attackingType}-${curr.defendingType}`] = curr.effectiveness;
      return acc;
    }, {} as Record<string, number>);

    try {
      const response = await fetch('/api/admin/type-matchups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchups: matchupsToSave }),
      })

      if (response.ok) {
        toast({
          title: '성공',
          description: '타입 상성이 저장되었습니다.',
        })
      } else {
        throw new Error('Failed to save type matchups')
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '저장에 실패했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">타입 상성 관리</h1>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? '저장 중...' : '변경사항 저장'}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>공격 타입</TableHead>
            <TableHead>수비 타입</TableHead>
            <TableHead>효과</TableHead>
            <TableHead>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {typeMatchups.map(matchup => (
            <TableRow key={`${matchup.attackingType}-${matchup.defendingType}`}>
              <TableCell>{matchup.attackingType}</TableCell>
              <TableCell>{matchup.defendingType}</TableCell>
              <TableCell>{effectivenessToString(matchup.effectiveness)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEffectivenessChange(matchup.attackingType, matchup.defendingType, 2)}>효과 증가</Button>
                  <Button size="sm" variant="outline" onClick={() => handleEffectivenessChange(matchup.attackingType, matchup.defendingType, 1)}>보통</Button>
                  <Button size="sm" variant="outline" onClick={() => handleEffectivenessChange(matchup.attackingType, matchup.defendingType, 0.5)}>효과 감소</Button>
                  <Button size="sm" variant="outline" onClick={() => handleEffectivenessChange(matchup.attackingType, matchup.defendingType, 0)}>효과 없음</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}