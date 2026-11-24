import type { BattleState } from "../engine/battleEngine"
import type { AbilityEffect } from "../models/ability"
import type { Unit } from "../models/unit"
import {
  applyDamage,
  applyHealing
} from "../models/hp"
import { recordCombatEvent } from "../events/combatEvents"

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

  applyDamage(target, damage)

  state.log.push(
    isCrit
      ? `${target.name} takes ${damage} CRITICAL damage!`
      : `${target.name} takes ${damage} damage`
  )

  recordCombatEvent(state, {
    type: "damage",
    actorId: source.id,
    targetId: target.id,
    amount: damage,
    critical: isCrit
  })

  if (target.hp <= 0) {
    recordCombatEvent(state, {
      type: "defeat",
      unitId: target.id
    })
  }

  break
}

    case "heal": {
      const missing =
        target.maxHp - target.hp

      const healed =
        Math.max(
          0,
          Math.min(
            effect.amount,
            missing
          )
        )

      applyHealing(target, healed)

      state.log.push(
        `${target.name} recovers ${healed} HP`
      )

      recordCombatEvent(state, {
        type: "heal",
        actorId: source.id,
        targetId: target.id,
        amount: healed
      })

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

  recordCombatEvent(state, {
    type: "status-applied",
    actorId: source.id,
    targetId: target.id,
    statusId: effect.status.id,
    statusName: effect.status.name
  })

  break
}

    case "removeStatus": {
      const existing = target.statuses.find(
        status => status.id === effect.statusId
      )

      if (existing) {
        target.statuses =
          target.statuses.filter(
            status =>
              status.id !== effect.statusId
          )

        state.log.push(
          `${target.name} is no longer affected by ${existing.name}`
        )

        recordCombatEvent(state, {
          type: "status-removed",
          actorId: source.id,
          targetId: target.id,
          statusId: existing.id,
          statusName: existing.name
        })
      }

      break
    }
  }
}