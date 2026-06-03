import type { Ability } from "../models/ability"

export const BasicAttack: Ability = {
  id: "basic_attack",
  name: "Basic Attack",

  effects: [
    {
      type: "damage",
      amount: 15
    }
  ]
}