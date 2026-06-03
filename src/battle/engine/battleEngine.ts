import type { Unit } from "../models/unit"
import type { Relationship } from "../models/relationship"
import { resolveEnemyTurn }
from "../ai/resolveEnemyTurn"
import { getRelationships } from "../relationships/getRelationships"
import { applyRelationshipBonuses } from "../relationships/applyRelationshipBonus"

export type BattleState = {
  units: Unit[]

  relationships: Relationship[]

  log: string[]

  currentActorId?: string

  turnPhase: "idle" | "player" | "enemy"

  turnResolved: boolean

  winner?: "player" | "enemy"
}

export function createBattle(
  units: Unit[]
): BattleState {

  const relationships =
    getRelationships(units)

  const state: BattleState = {
    units,

    relationships,

    log: [],

    currentActorId: undefined,

    turnPhase: "idle",

    turnResolved: false,

    winner: undefined
  }

  applyRelationshipBonuses(state)

  return state
}

export function tickBattle(
  state: BattleState
) {
  if (state.winner) return state

 if (state.currentActorId && !state.turnResolved) {
  return state
  }

  state.turnResolved = false

  for (const unit of state.units) {

    if (unit.hp <= 0) {
      continue
    }

    unit.timeline += unit.speed
  }

  const readyUnits =
    state.units.filter(
      u =>
        u.hp > 0 &&
        u.timeline >= 100
    )

  if (readyUnits.length === 0) {
    return state
  }

  readyUnits.sort(
    (a, b) =>
      b.speed - a.speed
  )

  const actor =
    readyUnits[0]

  state.currentActorId =
    actor.id

    

  state.turnPhase =
    actor.team === "player"
      ? "player"
      : "enemy"

  state.log.push(
    `${actor.name}'s turn begins`
  )

  if (actor.team === "enemy") {
  resolveEnemyTurn(
    state,
    actor
  )
}

  return state
}

export function endTurn(
  state: BattleState
) {
  if (!state.currentActorId) {
    return state
  }

  const actor =
    state.units.find(
      u =>
        u.id ===
        state.currentActorId
    )

  if (actor) {
    actor.timeline = 0
  }

  state.currentActorId = undefined

  state.turnPhase = "idle"

  state.turnResolved = true

  return state
}