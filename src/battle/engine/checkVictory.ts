import type { BattleState } from "./battleEngine"
import { grantXp } from "../progression/grantXp"

export function checkVictory(
  state: BattleState
) {

  const livingPlayers = state.units.filter(
    u =>
      u.team === "player" &&
      u.hp > 0
  )

  const livingEnemies = state.units.filter(
    u =>
      u.team === "enemy" &&
      u.hp > 0
  )

  if (livingPlayers.length === 0) {
    state.winner = "enemy"

    state.log.push(
      "Enemies are victorious!"
    )
  }

  if (livingEnemies.length === 0) {
    state.winner = "player"

    state.log.push(
      "Players are victorious!"
    )
    for (const unit of state.units) {

  if (
    unit.team === "player" &&
    unit.hp > 0
  ) {
    grantXp(unit, 50)
  }
}
  }
}