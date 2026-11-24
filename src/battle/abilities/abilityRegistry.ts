import type { Ability } from "../models/ability"
import { BasicAttack } from "./basicAttack"
import { PoisonStrike } from "./poisonStrike"
import { Claw } from "./claw"
import { ClassAbilities } from "./classAbilities"

export const AbilityRegistry: Record<string, Ability> = {
  basic_attack: BasicAttack,

  poison_strike: PoisonStrike,

  claw: Claw,

  ...ClassAbilities
}