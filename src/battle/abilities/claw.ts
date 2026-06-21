import type { Ability } from "../models/ability"

export const Claw: Ability = {
  id: "claw",

  name: "Claw",

  effects: [
    {
      type: "damage",

      amount: 10,

      multiplier: 1.2
    }
  ]
}