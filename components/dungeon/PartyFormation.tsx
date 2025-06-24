'use client'

import React, { Dispatch, SetStateAction } from 'react'
import PartySlot from './PartySlot'
import { ICritter } from '@/types'

interface IPartyFormationProps {
    party: (ICritter | null)[]
    onRemoveCritter: (index: number) => void
    totalPower: number
}

export function PartyFormation({ party, onRemoveCritter, totalPower }: IPartyFormationProps) {
    return (
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="grid grid-cols-3 gap-4">
                {party.map((critter, index) => (
                    <PartySlot
                        key={index}
                        id={String(index)}
                        critter={critter}
                        index={index}
                        onRemove={onRemoveCritter}
                    />
                ))}
            </div>
            <div className="mt-4 text-right">
                <p className="font-bold text-lg">Total Power: {totalPower}</p>
            </div>
        </div>
    )
} 