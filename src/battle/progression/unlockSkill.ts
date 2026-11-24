import type { Unit } from "../models/unit"
import { AbilityRegistry } from "../abilities/abilityRegistry"
import {
  getSkillAvailability,
  getNextAbilityId,
  getSkillValue
} from "../skills/skillTreeHelpers"

export function unlockSkill(
  unit: Unit,
  nodeId: string
): boolean {

  const node = unit.skillTree.find(
    n => n.id === nodeId
  )

  if (!node) return false

  const { available } =
    getSkillAvailability(unit, node)

  if (!available) return false

  unit.skillPoints -= node.cost

  node.rank += 1
  node.unlocked = true

  if (node.effect.type === "stat") {
    unit[node.effect.stat] +=
      getSkillValue(
        node,
        node.rank
      )
  }

  if (node.effect.type === "ability") {

    const abilityId =
      getNextAbilityId(
        node,
        node.rank
      )

    const previousId =
      node.rank > 1
        ? getNextAbilityId(
            node,
            node.rank - 1
          )
        : ""

    if (
      previousId &&
      previousId !== abilityId
    ) {
      unit.abilities =
        unit.abilities.filter(
          ability =>
            ability.id !== previousId
        )
    }

    const ability =
      AbilityRegistry[abilityId]

    if (
      ability &&
      !unit.abilities.some(
        a => a.id === ability.id
      )
    ) {
      unit.abilities.push({
        ...ability
      })
    }
  }

  return true
}
