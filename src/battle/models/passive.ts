export type Passive = {
  id: string

  name: string

  description: string

  effectType:
    | "speedAura"
    | "damageAura"
    | "poisonAura"

  amount: number
}