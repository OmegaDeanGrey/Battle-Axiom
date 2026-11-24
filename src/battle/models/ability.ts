import type { StatusEffect } from "./statusEffect"

export type AbilityEffect =
  | {
      type: "damage"

      amount: number

      multiplier?: number
    }

  | {
      type: "applyStatus"
      status: StatusEffect
    }

  | {
      type: "heal"
      amount: number
    }

  | {
      type: "removeStatus"
      statusId: string
    }

export type Ability = {
  id: string
  name: string

  effects: AbilityEffect[]
}