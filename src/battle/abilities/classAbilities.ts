import type { Ability } from "../models/ability"
import type { StatusEffect } from "../models/statusEffect"

function damage(
  id: string,
  name: string,
  amount: number,
  multiplier = 1
): Ability {
  return {
    id,
    name,
    effects: [
      {
        type: "damage",
        amount,
        multiplier
      }
    ]
  }
}

function heal(
  id: string,
  name: string,
  amount: number
): Ability {
  return {
    id,
    name,
    effects: [
      {
        type: "heal",
        amount
      }
    ]
  }
}

const Hex: StatusEffect = {
  id: "hex",
  name: "Hex",
  duration: 3,
  onTurnStart: {
    type: "damage",
    amount: 4
  }
}

export const ClassAbilities = {
  sword_strike:
    damage("sword_strike", "Sword Strike", 12),
  sword_strike_ii:
    damage("sword_strike_ii", "Sword Strike II", 22),
  sword_strike_iii:
    damage("sword_strike_iii", "Sword Strike III", 34),
  shield_bash:
    damage("shield_bash", "Shield Bash", 9),

  holy_light:
    heal("holy_light", "Holy Light", 25),
  holy_light_ii:
    heal("holy_light_ii", "Holy Light II", 45),
  smite:
    damage("smite", "Smite", 14),

  shadow_stab:
    damage("shadow_stab", "Shadow Stab", 14, 1.2),
  shadow_stab_ii:
    damage("shadow_stab_ii", "Shadow Stab II", 24, 1.2),
  backstab:
    damage("backstab", "Backstab", 18, 1.4),

  dragon_breath:
    damage("dragon_breath", "Dragon Breath", 18),
  dragon_breath_ii:
    damage("dragon_breath_ii", "Dragon Breath II", 30),
  tail_sweep:
    damage("tail_sweep", "Tail Sweep", 12),

  mend:
    heal("mend", "Mend", 20),
  mend_ii:
    heal("mend_ii", "Mend II", 35),
  life_bloom:
    heal("life_bloom", "Life Bloom", 15),

  bullseye:
    damage("bullseye", "Bullseye", 14, 1.3),
  feather_flight:
    damage("feather_flight", "Feather Flight", 10),
  falcon:
    damage("falcon", "Falcon Dive", 22),

  fire_bolt:
    damage("fire_bolt", "Fire Bolt", 16),
  fire_bolt_ii:
    damage("fire_bolt_ii", "Fire Bolt II", 28),
  frost_bolt:
    damage("frost_bolt", "Frost Bolt", 14),
  lightning:
    damage("lightning", "Lightning", 20),

  hex: {
    id: "hex",
    name: "Hex",
    effects: [
      {
        type: "damage",
        amount: 8
      },
      {
        type: "applyStatus",
        status: Hex
      }
    ]
  },
  hex_ii: {
    id: "hex_ii",
    name: "Hex II",
    effects: [
      {
        type: "damage",
        amount: 16
      },
      {
        type: "applyStatus",
        status: Hex
      }
    ]
  },
  weaken:
    damage("weaken", "Weaken", 10),

  spirit_wolf:
    damage("spirit_wolf", "Spirit Wolf", 15),
  spirit_wolf_ii:
    damage("spirit_wolf_ii", "Spirit Wolf II", 25),
  ifrit:
    damage("ifrit", "Ifrit", 30)
} as Record<string, Ability>
