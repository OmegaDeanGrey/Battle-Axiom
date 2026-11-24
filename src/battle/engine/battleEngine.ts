import type { Unit } from "../models/unit"
import type { Relationship } from "../models/relationship"
import { resolveEnemyTurn }
from "../ai/resolveEnemyTurn"
import {
  getSynergyBonuses,
  type SynergyBonuses
} from "../synergy/getSynergyBonuses"
import { applySynergyBonuses } from "../synergy/applySynergyBonuses"
import { clampUnitHp } from "../models/hp"
import {
  recordCombatEvent,
  type CombatEvent
} from "../events/combatEvents"

export type BattleState = {
  id: string

  units: Unit[]

  relationships: Relationship[]

  synergyBonuses: SynergyBonuses

  log: string[]

  combatEvents: CombatEvent[]

  currentActorId?: string

  turnPhase: "idle" | "player" | "enemy"

  turnResolved: boolean

  actedThisCycleIds: string[]

  winner?: "player" | "enemy"
}

function createBattleId(): string {
  return `battle-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

export function createBattle(
  units: Unit[],
  savedRelationships: Relationship[] = []
): BattleState {

  const participantIds =
    new Set(
      units
        .filter(
          unit =>
            unit.team === "player"
        )
        .map(unit => unit.id)
    )

  const relationships =
    savedRelationships.filter(
      relationship =>
        relationship.members.every(
          member =>
            participantIds.has(
              member.heroId
            )
        )
    )

  const synergyBonuses =
    getSynergyBonuses(
      units.filter(
        unit => unit.team === "player"
      )
    )

  const state: BattleState = {
    id: createBattleId(),

    units,

    relationships,

    synergyBonuses,

    log: [],

    combatEvents: [],

    currentActorId: undefined,

    turnPhase: "idle",

    turnResolved: false,

    actedThisCycleIds: [],

    winner: undefined
  }

  applySynergyBonuses(
    state,
    synergyBonuses
  )

  for (const unit of units) {
    clampUnitHp(unit)
  }

  return state
}

function eligibleUnits(
  state: BattleState
) {
  return state.units.filter(
    unit => unit.hp > 0
  )
}

function sortByInitiative(
  state: BattleState,
  units: Unit[]
) {
  const order = new Map(
    state.units.map((unit, index) => [
      unit.id,
      index
    ])
  )

  return [...units].sort(
    (a, b) =>
      b.timeline - a.timeline ||
      b.speed - a.speed ||
      (order.get(a.id) ?? 0) -
        (order.get(b.id) ?? 0)
  )
}

export function tickBattle(
  state: BattleState
) {
  if (state.winner) return state

  if (
    state.currentActorId &&
    !state.turnResolved
  ) {
    return state
  }

  state.turnResolved = false

  const eligible = eligibleUnits(state)

  state.actedThisCycleIds =
    state.actedThisCycleIds.filter(
      id =>
        eligible.some(
          unit => unit.id === id
        )
    )

  for (const unit of eligible) {
    unit.timeline += unit.speed
  }

  const readyUnits = sortByInitiative(
    state,
    eligible.filter(
      unit => unit.timeline >= 100
    )
  )

  if (readyUnits.length === 0) {
    return state
  }

  const unactedReady =
    readyUnits.filter(
      unit =>
        !state.actedThisCycleIds.includes(
          unit.id
        )
    )

  const cycleComplete =
    eligible.every(unit =>
      state.actedThisCycleIds.includes(
        unit.id
      )
    )

  if (
    unactedReady.length === 0 &&
    !cycleComplete
  ) {
    return state
  }

  if (cycleComplete) {
    state.actedThisCycleIds = []
  }

  const actor =
    unactedReady[0] ??
    sortByInitiative(state, readyUnits)[0]

  state.currentActorId = actor.id

  state.turnPhase =
    actor.team === "player"
      ? "player"
      : "enemy"

  state.log.push(
    `${actor.name}'s turn begins`
  )

  recordCombatEvent(state, {
    type: "turn-start",
    unitId: actor.id
  })

  if (actor.team === "enemy") {
    resolveEnemyTurn(state, actor)
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

    if (
      actor.hp > 0 &&
      !state.actedThisCycleIds.includes(
        actor.id
      )
    ) {
      state.actedThisCycleIds.push(
        actor.id
      )
    }
  }

  const eligible = eligibleUnits(state)

  if (
    eligible.length > 0 &&
    eligible.every(unit =>
      state.actedThisCycleIds.includes(
        unit.id
      )
    )
  ) {
    state.actedThisCycleIds = []
  }

  state.currentActorId = undefined

  state.turnPhase = "idle"

  state.turnResolved = true

  return state
}