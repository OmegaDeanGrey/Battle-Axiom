export type RelationshipBonus = {
  type: "stat"

  stat: "speed" | "hp" | "maxHp" | "attack" | "defense"

  baseValue: number

  perLevel?: number
}

export type Relationship = {
  id: string

  name: string

  members: string[]

  level: number

  xp: number

  xpToNextLevel: number

  bonuses: RelationshipBonus[]
}