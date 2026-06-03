import type { BattleState } from "./battleEngine"
import type { Action } from "../models/action"
import { resolveEffect } from "../effects/resolveEffect"

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

  state.log.push(
    `${actor.name} uses ${ability.name}`
  )

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
  }}