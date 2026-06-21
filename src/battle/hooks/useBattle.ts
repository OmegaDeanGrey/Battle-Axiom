import { useState, useEffect } from "react"
import {
  createBattle,
  tickBattle,
  type BattleState
} from "../engine/battleEngine"

import type { Unit } from "../models/unit"

import { performAction } from "../engine/performAction"

export function useBattle(initialUnits: Unit[]) {
  const [battle, setBattle] = useState<BattleState>(() =>
    createBattle(initialUnits)
  )

function tick() {
  setBattle(prev => {
    const next = structuredClone(prev)

    tickBattle(next)

    return next
  })
}

useEffect(() => {

  if (
    battle.turnPhase !== "enemy" ||
    !battle.currentActorId
  ) {
    return
  }

  const actor = battle.units.find(
    u => u.id === battle.currentActorId
  )

  if (!actor) return

  const target = battle.units.find(
    u =>
      u.team === "player" &&
      u.hp > 0
  )

  if (!target) return

  act(
    actor.abilities[0].id,
    target.id
  )

}, [battle.currentActorId])

function act(
  abilityId: string,
  targetId: string
) {

  setBattle(prev => {

    const next = structuredClone(prev)

    const actorId = next.currentActorId

    if (!actorId) return next

    performAction(next, {
      type: "ability",
      abilityId,
      targetId
    })

    return next
  })
}

  return {
    battle,
    tick,
    act
  }
}