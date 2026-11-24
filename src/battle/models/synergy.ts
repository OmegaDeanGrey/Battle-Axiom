import type { HeroTag } from "../data/TagRegistry"

export type SynergyBonusType =
  | "defense"
  | "attack"
  | "speed"
  | "maxHp"
  | "critChance"
  | "damage"
  | "physicalDamage"
  | "magicDamage"
  | "regen"
  | "buffPower"
  | "statusPower"
  | "healing"
  | "critDamage"
  | "summonPower"

export type SynergyDefinition = {
  id: string
  name: string
  tags: HeroTag[]
  threshold: number
  description: string
  bonus: {
    type: SynergyBonusType
    value: number
  }
}

export type ActiveSynergy = SynergyDefinition & {
  count: number
  contributors: string[]
}
