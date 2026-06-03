import type { StatusEffect } from "./statusEffect"

export type AbilityEffect =
  | {
      type: "damage"
      amount: number
    }

  | {
      type: "applyStatus"
      status: StatusEffect
    }

  | {
      type: "heal"
      amount: number
    }

export type Ability = {
  id: string
  name: string

  effects: AbilityEffect[]
}