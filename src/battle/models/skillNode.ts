import type { UnitStatKey } from "./unit"

export type SkillEffect =
  | {
      type: "stat"
      stat: UnitStatKey
      value: number
      perRank?: number
    }
  | {
      type: "ability"
      abilityId: string
      rankedAbilityIds?: string[]
    }

export type SkillNode = {
  id: string
  name: string
  description: string

  cost: number
  unlocked: boolean

  rank: number
  maxRank: number
  minLevel: number
  tier: number
  branch: string

  requires?: string[]

  effect: SkillEffect
}

export type SkillNodeTemplate =
  Omit<SkillNode, "rank" | "unlocked">
