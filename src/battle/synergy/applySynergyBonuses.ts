import type { BattleState } from "../engine/battleEngine"
import type { SynergyBonuses } from "./getSynergyBonuses"
import { setUnitHp } from "../models/hp"

export function applySynergyBonuses(
  state: BattleState,
  bonuses: SynergyBonuses
) {

  state.synergyBonuses = bonuses

  for (const unit of state.units) {

    if (unit.team !== "player") continue

    const defense = bonuses.defense || 0
    const attack = bonuses.attack || 0
    const speed = bonuses.speed || 0
    const maxHp = bonuses.maxHp || 0
    const critChance =
      (bonuses.critChance || 0) / 100

    unit.defense += defense
    unit.attack += attack
    unit.speed += speed

    if (maxHp > 0) {
      unit.maxHp += maxHp
      setUnitHp(unit, unit.hp + maxHp)
    }

    unit.critChance += critChance
  }
}
