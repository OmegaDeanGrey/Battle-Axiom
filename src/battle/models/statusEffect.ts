export type StatusEffect = {
  id: string
  name: string

  duration: number

  onTurnStart?: {
    type: "damage"
    amount: number
  }
}