import type { StatusEffect } from "../models/statusEffect"

export const Poison: StatusEffect = {
  id: "poison",
  name: "Poison",

  duration: 3,

  onTurnStart: {
    type: "damage",
    amount: 5
  }
}