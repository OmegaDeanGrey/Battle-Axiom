import type { BattleState } from "../engine/battleEngine"
import type { Unit } from "../models/unit"

export function processTurnStartStatuses(
  state: BattleState,
  unit: Unit
) {

  for (const status of unit.statuses) {

    if (status.onTurnStart) {

      switch (status.onTurnStart.type) {

        case "damage": {

          unit.hp -= status.onTurnStart.amount

          state.log.push(
            `${unit.name} suffers ${status.onTurnStart.amount} damage from ${status.name}`
          )

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