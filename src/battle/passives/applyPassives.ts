import type { BattleState }
from "../engine/battleEngine"

export function applyPassives(
  state: BattleState
) {

  for (const unit of state.units) {

    for (const passive of unit.passives) {

      switch (passive.effectType) {

        case "speedAura":

          for (const ally of state.units) {

            if (
              ally.team === unit.team &&
              ally.tags.includes("Beast")
            ) {

              ally.speed += passive.amount
            }
          }

          break
      }
    }
  }
}