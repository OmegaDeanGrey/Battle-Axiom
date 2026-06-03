import type { Unit } from "../models/unit"

export function grantXp(
  unit: Unit,
  amount: number
) {

  unit.xp += amount

  const xpNeeded =
    unit.level * 100

  if (unit.xp >= xpNeeded) {

    unit.xp -= xpNeeded

    unit.level += 1

    unit.skillPoints += 1

    unit.maxHp += 10
    unit.hp = unit.maxHp

    unit.speed += 2
  }
}