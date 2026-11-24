import type { BattleState } from "../engine/battleEngine"
import type { Unit } from "../models/unit"
import { applyDamage } from "../models/hp"
import { recordCombatEvent } from "../events/combatEvents"

export function processTurnStartStatuses(
  state: BattleState,
  unit: Unit
) {

  for (const status of unit.statuses) {

    if (status.onTurnStart) {

      switch (status.onTurnStart.type) {

        case "damage": {

          applyDamage(
            unit,
            status.onTurnStart.amount
          )

          state.log.push(
            `${unit.name} suffers ${status.onTurnStart.amount} damage from ${status.name}`
          )

          recordCombatEvent(state, {
            type: "status-tick",
            targetId: unit.id,
            amount: status.onTurnStart.amount,
            statusId: status.id,
            statusName: status.name
          })

          if (unit.hp <= 0) {
            recordCombatEvent(state, {
              type: "defeat",
              unitId: unit.id
            })
          }

          break
        }
      }
    }

    // reduce duration
    status.duration -= 1
  }

  // remove expired statuses
  unit.statuses = unit.statuses.filter(
    s => s.duration > 0
  )
}