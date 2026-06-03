import type { BattleState } from "../engine/battleEngine"

import { countTag } from "./checkSynergies"

export function applyPackTactics(
  state: BattleState
) {

  const beastCount = countTag(
    state.units,
    "player",
    "Beast"
  )

  if (beastCount >= 3) {

    for (const unit of state.units) {

      if (
        unit.team === "player" &&
        unit.tags.includes("Beast")
      ) {
        unit.speed += 10
      }
    }

    state.log.push(
      "Pack Tactics activated!"
    )
  }
}