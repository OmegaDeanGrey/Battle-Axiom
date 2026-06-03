import type { Unit } from "../models/unit"
import { AbilityRegistry } from "../abilities/abilityRegistry"

export function unlockSkill(
  unit: Unit,
  nodeId: string
) {

  const node = unit.skillTree.find(
    n => n.id === nodeId
  )

  if (!node) return

  if (node.unlocked) return

  if (unit.skillPoints < node.cost) return

  // prerequisite check
  if (node.requires) {

    for (const req of node.requires) {

      const requiredNode =
        unit.skillTree.find(
          n => n.id === req
        )

      if (!requiredNode?.unlocked) {
        return
      }
    }
  }

  // spend points
  unit.skillPoints -= node.cost

  // unlock node
  node.unlocked = true

  // apply stat effect
  if (node.effect.type === "stat") {

    const stat = node.effect.stat

    const value = node.effect.value

    unit[stat] += value
  }

  // ability unlock support
if (node.effect.type === "ability") {

  const ability =
    AbilityRegistry[
      node.effect.abilityId as keyof typeof AbilityRegistry
    ]

  if (!ability) return

  const alreadyHasAbility =
    unit.abilities.some(
      a => a.id === ability.id
    )

  if (!alreadyHasAbility) {

    unit.abilities.push(ability)
  }
}
}