import type { Unit } from "../models/unit"

export function getXpToNextLevel(
  level: number
) {
  return level * 100
}

export function grantXp(
  unit: Unit,
  amount: number
): number {

  unit.xp += amount

  let levelsGained = 0

  while (
    unit.xp >=
    getXpToNextLevel(unit.level)
  ) {
    unit.xp -=
      getXpToNextLevel(unit.level)

    unit.level += 1

    unit.skillPoints += 1

    levelsGained += 1
  }

  return levelsGained
}
