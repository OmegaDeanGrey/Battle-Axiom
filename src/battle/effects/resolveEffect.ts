import type { BattleState } from "../engine/battleEngine"
import type { AbilityEffect } from "../models/ability"
import type { Unit } from "../models/unit"

export function resolveEffect(
  state: BattleState,
  source: Unit,
  target: Unit,
  effect: AbilityEffect
) {

  switch (effect.type) {

case "damage": {

  const attackBonus =
    Math.floor(source.attack / 5)

  const defenseReduction =
    Math.floor(target.defense / 5)

  const damage = Math.max(
    1,
    effect.amount +
    attackBonus -
    defenseReduction
  )

  target.hp -= damage

  state.log.push(
    `${target.name} takes ${damage} damage`
  )

  break
}

   case "applyStatus": {
  const existing = target.statuses.find(
    s => s.id === effect.status.id
  )

  if (existing) {
    // refresh duration instead of stacking
    existing.duration = effect.status.duration
  } else {
    target.statuses.push({
      ...effect.status
    })

    state.log.push(
      `${target.name} gains ${effect.status.name}`
    )
  }

  break
}
  }
}