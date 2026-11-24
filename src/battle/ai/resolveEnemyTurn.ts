import type { BattleState } from "../engine/battleEngine"
import type { Unit } from "../models/unit"

import { resolveAction } from "../engine/actionResolver"
import { endTurn } from "../engine/battleEngine"
import { checkVictory } from "../engine/checkVictory"

export function resolveEnemyTurn(
  state: BattleState,
  actor: Unit
) {
  const targets = state.units.filter(
    u =>
      u.team !== actor.team &&
      u.hp > 0
  )

  if (!targets.length || !actor.abilities.length) {
    endTurn(state)
    return
  }

  const target =
    targets[Math.floor(Math.random() * targets.length)]

  const ability =
    actor.abilities[
      Math.floor(Math.random() * actor.abilities.length)
    ]

  resolveAction(
    state,
    actor.id,
    {
      type: "ability",
      abilityId: ability.id,
      targetId: target.id
    }
  )

  checkVictory(state)

  endTurn(state)
}