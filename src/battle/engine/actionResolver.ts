import type { BattleState } from "./battleEngine"
import type { Action } from "../models/action"
import { resolveEffect } from "../effects/resolveEffect"
import { recordCombatEvent } from "../events/combatEvents"
import {
  getItemEffectKinds,
  isBattleConsumable,
  ItemRegistry
} from "../../game/data/ItemRegistry"
import {
  getValidItemTargetIds
} from "./itemTargets"

export function resolveAction(
  state: BattleState,
  actorId: string,
  action: Action
) {
  const actor = state.units.find(u => u.id === actorId)
  if (!actor || actor.hp <= 0) return

  switch (action.type) {
  case "ability": {
  const target = state.units.find(
    u => u.id === action.targetId
  )

  if (!target || target.hp <= 0) return

  const ability = actor.abilities.find(
  a => a.id === action.abilityId
)

if (!ability) return

  const isSupport =
    ability.effects.some(
      effect => effect.type === "heal"
    )

  if (
    isSupport
      ? target.team !== actor.team
      : target.team === actor.team
  ) {
    return
  }

  state.log.push(
    `${actor.name} uses ${ability.name}`
  )

  recordCombatEvent(state, {
    type: "ability-used",
    actorId: actor.id,
    abilityId: ability.id,
    abilityName: ability.name,
    targetId: target.id,
    effectKinds: ability.effects.map(
      effect => effect.type
    )
  })

  for (const effect of ability.effects) {
    resolveEffect(
      state,
      actor,
      target,
      effect
    )
  }

  break
  }

  case "item": {
    if (
      !isBattleConsumable(action.itemId)
    ) {
      return
    }

    const validTargetIds =
      getValidItemTargetIds(
        state.units,
        actor,
        action.itemId
      )

    if (
      !validTargetIds.includes(
        action.targetId
      )
    ) {
      return
    }

    const target = state.units.find(
      unit => unit.id === action.targetId
    )

    if (!target) return

    const item =
      ItemRegistry[action.itemId]

    state.log.push(
      `${actor.name} uses ${
        item.name
      } on ${target.name}`
    )

    recordCombatEvent(state, {
      type: "item-used",
      actorId: actor.id,
      itemId: item.id,
      itemName: item.name,
      targetId: target.id,
      effectKinds:
        getItemEffectKinds(
          action.itemId
        )
    })

    for (const effect of
      item.combat?.effects ?? []) {
      resolveEffect(
        state,
        actor,
        target,
        effect
      )
    }

    break
  }
  }
}