import type { BattleState } from "../engine/battleEngine"
import type { Unit } from "../models/unit"

import { resolveAction } from "../engine/actionResolver"
import { endTurn } from "../engine/battleEngine"

export function resolveEnemyTurn(
  state: BattleState,
  actor: Unit
) {
  const target = state.units.find(
    u =>
      u.team !== actor.team &&
      u.hp > 0
  )

  if (!target) {
    endTurn(state)
    return
  }

  const ability = actor.abilities[0]

  resolveAction(
    state,
    actor.id,
    {
      type: "ability",
      abilityId: ability.id,
      targetId: target.id
    }
  )

  endTurn(state)
}