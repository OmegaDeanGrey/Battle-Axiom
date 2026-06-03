import type { Unit } from "../models/unit"

export function countTag(
  units: Unit[],
  team: "player" | "enemy",
  tag: string
) {
  return units.filter(
    u =>
      u.team === team &&
      u.hp > 0 &&
      u.tags.includes(tag)
  ).length
}