import type { UnitStatKey } from "./unit"

export type SkillEffect =
  | {
      type: "stat"
      stat: UnitStatKey
      value: number
    }
  | {
      type: "ability"
      abilityId: string
    }

export type SkillNode = {
  id: string
  name: string
  description: string

  cost: number

  unlocked: boolean

  requires?: string[]

  effect: SkillEffect
}