import type { Unit } from "../models/unit"
import {
  isBattleConsumable,
  ItemRegistry
} from "../../game/data/ItemRegistry"

export function getValidItemTargetIds(
  units: Unit[],
  actor: Unit,
  itemId: string
): string[] {
  if (
    actor.hp <= 0 ||
    actor.team !== "player" ||
    !isBattleConsumable(itemId)
  ) {
    return []
  }

  const definition =
    ItemRegistry[itemId].combat

  if (!definition) return []

  const eligible = units.filter(unit => {
    if (definition.targetMode === "self") {
      return unit.id === actor.id
    }

    if (definition.targetMode === "none") {
      return unit.id === actor.id
    }

    if (unit.team !== actor.team) {
      return false
    }

    if (
      unit.hp <= 0 &&
      !definition.allowDefeated
    ) {
      return false
    }

    if (
      definition.requiresStatusId &&
      !unit.statuses.some(
        status =>
          status.id ===
          definition.requiresStatusId
      )
    ) {
      return false
    }

    return true
  })

  return eligible.map(unit => unit.id)
}
