import type { Ability } from "./ability"
import type { SkillNode } from "./skillNode"
import type { StatusEffect } from "./statusEffect"
import type { Passive } from "./passive"

export type UnitStatKey =
  | "hp"
  | "maxHp"
  | "speed"
  | "attack"
  | "defense"

export type Unit = {
  id: string
  name: string

  heroClass: string

  team: "player" | "enemy"
  
  hp: number
  maxHp: number

  attack: number
  defense: number

  critChance: number
  critMultiplier: number
  damageVariance: number

  speed: number
  timeline: number

  level: number
  xp: number
  skillPoints: number

  skillTree: SkillNode[]

  abilities: Ability[]
  statuses: StatusEffect[]
  passives: Passive[]

   description: string

  portrait: string

  isPlayer?: boolean

  tags: string[]
}