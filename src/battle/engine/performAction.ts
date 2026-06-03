import type { BattleState } from "./battleEngine"
import { resolveAction } from "./actionResolver"
import { endTurn } from "./battleEngine"
import type { Action } from "../models/action"
import { processTurnStartStatuses } from "../status/processStatuses"
import { checkVictory } from "./checkVictory"

export function performAction(
  state: BattleState,
  action: Action
) {
  const actorId = state.currentActorId
  if (!actorId) return state

  const actor = state.units.find(
  u => u.id === actorId
)

if (actor) {
  processTurnStartStatuses(state, actor)
}
  // 1. resolve action effects
  resolveAction(state, actorId, action)

  checkVictory(state)
  // 2. end turn (RESET + CLEAR ACTOR)
  endTurn(state)

  return state
}