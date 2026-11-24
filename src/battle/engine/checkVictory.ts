import type { BattleState } from "./battleEngine"
import { recordCombatEvent } from "../events/combatEvents"

export function checkVictory(
  state: BattleState
) {

  if (state.winner) return

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

    recordCombatEvent(state, {
      type: "victory",
      winner: "enemy"
    })
  }

  if (livingEnemies.length === 0) {
    state.winner = "player"

    state.log.push(
      "Players are victorious!"
    )

    recordCombatEvent(state, {
      type: "victory",
      winner: "player"
    })
  }
}
