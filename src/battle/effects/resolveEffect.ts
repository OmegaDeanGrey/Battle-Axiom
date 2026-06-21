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

const multiplier =
  effect.multiplier ?? 1

const variance =
  1 +
  (
    (Math.random() * 2 - 1)
    *
    source.damageVariance
  )

let damage =
  (
    effect.amount +
    source.attack +
    attackBonus
  )
  *
  multiplier
  *
  variance

  const isCrit =
    Math.random()
    <
    source.critChance

  if (isCrit) {
    damage *= source.critMultiplier
  }

  damage -= defenseReduction

  damage = Math.max(
    1,
    Math.floor(damage)
  )

  target.hp -= damage

  state.log.push(
    isCrit
      ? `${target.name} takes ${damage} CRITICAL damage!`
      : `${target.name} takes ${damage} damage`
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