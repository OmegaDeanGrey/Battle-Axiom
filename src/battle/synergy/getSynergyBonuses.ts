import type { Unit } from "../models/unit"
import type { SynergyBonusType } from "../models/synergy"
import {
  getActiveSynergies
} from "./getActiveSynergies"

export type SynergyBonuses =
  Partial<Record<SynergyBonusType, number>>

export function getSynergyBonuses(
  party: Unit[]
): SynergyBonuses {

  const totals: SynergyBonuses = {}

  for (const synergy of getActiveSynergies(party)) {
    const { type, value } = synergy.bonus

    totals[type] =
      (totals[type] || 0) + value
  }

  return totals
}
