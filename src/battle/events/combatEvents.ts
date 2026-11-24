import type { AbilityEffect } from "../models/ability"

export type CombatEvent =
  | {
      type: "turn-start"
      unitId: string
    }

  | {
      type: "ability-used"
      actorId: string
      abilityId: string
      abilityName: string
      targetId: string
      effectKinds: AbilityEffect["type"][]
    }

  | {
      type: "item-used"
      actorId: string
      itemId: string
      itemName: string
      targetId: string
      effectKinds: AbilityEffect["type"][]
    }

  | {
      type: "damage"
      actorId: string
      targetId: string
      amount: number
      critical: boolean
    }

  | {
      type: "heal"
      actorId: string
      targetId: string
      amount: number
    }

  | {
      type: "status-applied"
      actorId: string
      targetId: string
      statusId: string
      statusName: string
    }

  | {
      type: "status-removed"
      actorId: string
      targetId: string
      statusId: string
      statusName: string
    }

  | {
      type: "status-tick"
      targetId: string
      amount: number
      statusId: string
      statusName: string
    }

  | {
      type: "miss"
      actorId: string
      targetId: string
    }

  | {
      type: "defeat"
      unitId: string
    }

  | {
      type: "victory"
      winner: "player" | "enemy"
    }

type CombatEventSink = {
  combatEvents: CombatEvent[]
}

export function recordCombatEvent(
  sink: CombatEventSink,
  event: CombatEvent
) {
  sink.combatEvents.push(event)
}
