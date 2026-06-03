import type { Ability } from "../models/ability"
import { Poison } from "../status/poison"

export const PoisonStrike: Ability = {
  id: "poison_strike",
  name: "Poison Strike",
  effects: [
    {
      type: "damage",
      amount: 10
    },
    {
      type: "applyStatus",
      status: Poison
    }
  ]
}