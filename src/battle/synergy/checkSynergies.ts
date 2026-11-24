import type { Unit } from "../models/unit"
import type { HeroTag } from "../data/TagRegistry"

export function countTag(
  units: Unit[],
  team: "player" | "enemy",
  tag: HeroTag
) {
  return units.filter(
    u =>
      u.team === team &&
      u.hp > 0 &&
      u.tags.includes(tag)
  ).length
}