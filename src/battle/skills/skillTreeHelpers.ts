import type { Unit } from "../models/unit"
import type { SkillNode } from "../models/skillNode"

export function getSkillValue(
  node: SkillNode,
  rank: number
): number {

  if (node.effect.type !== "stat") {
    return 0
  }

  return (
    node.effect.value +
    (rank - 1) *
      (node.effect.perRank ?? 0)
  )
}

export function getSkillAvailability(
  unit: Unit,
  node: SkillNode
): {
  available: boolean
  reason: string
} {

  if (node.rank >= node.maxRank) {
    return {
      available: false,
      reason: "Max rank"
    }
  }

  if (unit.level < node.minLevel) {
    return {
      available: false,
      reason: `Requires level ${node.minLevel}`
    }
  }

  if (unit.skillPoints < node.cost) {
    return {
      available: false,
      reason: "Not enough skill points"
    }
  }

  for (const requiredId of
    node.requires || []) {

    const required = unit.skillTree.find(
      n =>
        n.id === requiredId &&
        n.rank > 0
    )

    if (!required) {
      return {
        available: false,
        reason: "Prerequisite not learned"
      }
    }
  }

  return {
    available: true,
    reason: ""
  }
}

export function getNextAbilityId(
  node: SkillNode,
  rank: number
): string {

  if (node.effect.type !== "ability") {
    return ""
  }

  const ranked =
    node.effect.rankedAbilityIds

  if (ranked && ranked[rank - 1]) {
    return ranked[rank - 1]
  }

  return node.effect.abilityId
}
