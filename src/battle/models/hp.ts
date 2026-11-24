import type { Unit } from "./unit"

export function clampUnitHp(unit: Unit): void {
  unit.maxHp = Math.max(0, unit.maxHp)
  unit.hp = Math.min(
    Math.max(0, unit.hp),
    unit.maxHp
  )
}

export function applyDamage(
  unit: Unit,
  amount: number
): void {
  if (Number.isFinite(amount) && amount > 0) {
    unit.hp -= amount
  }

  clampUnitHp(unit)
}

export function applyHealing(
  unit: Unit,
  amount: number
): void {
  if (Number.isFinite(amount) && amount > 0) {
    unit.hp = Math.min(
      unit.hp + amount,
      unit.maxHp
    )
  }

  clampUnitHp(unit)
}

export function setUnitHp(
  unit: Unit,
  hp: number
): void {
  unit.hp = hp
  clampUnitHp(unit)
}
