import type { BattleState }
from "../engine/battleEngine"

export function applyRelationshipBonuses(
  state: BattleState
) {
  for (const relationship of state.relationships) {

    for (const bonus of relationship.bonuses) {

      const value =
        bonus.baseValue +
        (
          (relationship.level - 1)
          * (bonus.perLevel ?? 0)
        )

      for (const unit of state.units) {

        if (
          !relationship.members.includes(
            unit.name
          )
        ) {
          continue
        }

        switch (bonus.stat) {

          case "speed":
            unit.speed += value
            break

          case "attack":
            unit.attack += value
            break

          case "defense":
            unit.defense += value
            break

          case "hp":
            unit.hp += value
            break

          case "maxHp":
            unit.maxHp += value
            break
        }
      }
    }
  }
}