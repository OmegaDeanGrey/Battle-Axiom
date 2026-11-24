import type { Unit } from "../models/unit"

export type CharacterPose =
  | "idle"
  | "attack"
  | "casting"
  | "damage"
  | "defeated"
  | "victory"

export type Facing = "left" | "right"

export type CharacterVisualConfig = {
  poses?: Partial<Record<CharacterPose, string>>
  scale?: number
  offsetX?: number
  offsetY?: number
  facing?: Facing
  accent?: string
}

export type ResolvedCharacterVisual = {
  src: string
  scale: number
  offsetX: number
  offsetY: number
  facing: Facing
  accent: string
}

export const PLACEHOLDER_CHARACTER =
  "/battle/characters/placeholder-character.svg"

export const PLACEHOLDER_BACKGROUND =
  "/battle/backgrounds/TwellOutskirtsBattle.png"

const DEFAULT_CHARACTER_VISUAL: Required<
  Omit<CharacterVisualConfig, "poses">
> = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  facing: "left",
  accent: "#d8c7a1"
}

export const CHARACTER_VISUALS: Record<
  string,
  CharacterVisualConfig
> = {
  knight: {
        poses: {
      idle: "/battle/characters/KnightIdle.png"
    },
    scale: .62,
    offsetY: 2,
    facing: "left",
    accent: "#e3c46a"
  },
  rogue: {
        poses: {
      idle: "/battle/characters/RogueIdle.png"
    },
    scale: 0.58,
    offsetY: 4,
    facing: "left",
    accent: "#9fc9a4"
  },
  priest: {
        poses: {
      idle: "/battle/characters/PriestIdle.png"
    },
    scale: .60,
    offsetY: 3,
    facing: "left",
    accent: "#f2e3ad"
  },
  mage: {
        poses: {
      idle: "/battle/characters/MageIdle.png"
    },
    scale: .56,
    offsetY: 2,
    facing: "left",
    accent: "#a8b7f0"
  },
  witch: {
        poses: {
      idle: "/battle/characters/WitchIdle.png"
    },
    scale: .59,
    offsetY: 2,
    facing: "left",
    accent: "#c9a4e8"
  },
  fairy: {
        poses: {
      idle: "/battle/characters/FairyIdle.png"
    },
    scale: 0.56,
    offsetY: 5,
    facing: "left",
    accent: "#bfe6cf"
  },
  baby_dragon: {
        poses: {
      idle: "/battle/characters/BabyDragonIdle.png"
    },
    scale: .50,
    offsetY: 6,
    facing: "left",
    accent: "#e5a36e"
  },
  elven_ranger: {
        poses: {
      idle: "/battle/characters/ElvenRangerIdle.png"
    },
    scale: .64,
    offsetY: 3,
    facing: "left",
    accent: "#a9d4a0"
  },
  summoner: {
        poses: {
      idle: "/battle/characters/SummonerIdle.png"
    },
    scale: .64,
    offsetY: 2,
    facing: "left",
    accent: "#b7a6e0"
  },
  goblin: {
    poses: {
      idle: "/battle/characters/GoblinHenchmanIdle.png"
    },
    scale: 0.82,
    offsetY: 0,
    facing: "right",
    accent: "#9dbf72"
  },
  hobgoblin: {
    poses: {
      idle: "/battle/characters/HobgoblinIdle.png"
    },
    scale: 0.92,
    offsetY: 1,
    facing: "right",
    accent: "#d18b64"
  },
  orc: {
    poses: {
      idle: "/battle/characters/OrcIdle.png"
    },
    scale: 1,
    offsetY: 2,
    facing: "right",
    accent: "#a8bb8c"
  },
  nightmare: {
    poses: {
      idle: "/battle/characters/NightmareIdle.png"
    },
    scale: 1.04,
    offsetY: 8,
    facing: "right",
    accent: "#b7a0ee"
  },
  king_goblin: {
    poses: {
      idle:
        "/battle/characters/GoblinKingIdle.png"
    },
    scale: 1.76,
    offsetY: 3,
    facing: "right",
    accent: "#f0c84e"
  }
}

export const BATTLE_BACKGROUNDS: Record<string, string> = {
  default: PLACEHOLDER_BACKGROUND,
  "twell-outskirts": PLACEHOLDER_BACKGROUND
}

function visualKeys(unit: Unit): string[] {
  return [
    unit.id,
    unit.name.toLowerCase(),
    unit.heroClass.toLowerCase(),
    unit.name.toLowerCase().replace(/[\s-]+/g, "_")
  ]
}

export function getCharacterVisual(
  unit: Unit,
  pose: CharacterPose
): ResolvedCharacterVisual {
  const key = visualKeys(unit).find(
    candidate => candidate in CHARACTER_VISUALS
  )

  const config: CharacterVisualConfig =
    (key && CHARACTER_VISUALS[key]) || {}

  const facing =
    config.facing ??
    (unit.team === "enemy" ? "right" : "left")

  const poseSources = config.poses ?? {}

  const src =
    poseSources[pose] ??
    poseSources.idle ??
    PLACEHOLDER_CHARACTER

  return {
    src,
    facing,
    scale: config.scale ?? DEFAULT_CHARACTER_VISUAL.scale,
    offsetX: config.offsetX ?? DEFAULT_CHARACTER_VISUAL.offsetX,
    offsetY: config.offsetY ?? DEFAULT_CHARACTER_VISUAL.offsetY,
    accent: config.accent ?? DEFAULT_CHARACTER_VISUAL.accent
  }
}

export function getBattleBackground(
  locationId?: string
): string {
  if (!locationId) return BATTLE_BACKGROUNDS.default

  return (
    BATTLE_BACKGROUNDS[locationId] ??
    BATTLE_BACKGROUNDS.default
  )
}

const MAGIC_ABILITIES =
  /^(fire_|frost_|lightning|smite|hex|weaken|spirit_|ifrit|dragon_breath)/i

const PHYSICAL_ABILITIES = new Set([
  "poison_strike",
  "basic_attack",
  "claw",
  "sword_strike",
  "sword_strike_ii",
  "sword_strike_iii",
  "shield_bash",
  "shadow_stab",
  "shadow_stab_ii",
  "backstab",
  "tail_sweep",
  "bullseye",
  "feather_flight",
  "falcon"
])

export type PresentationActionKind =
  | "physical"
  | "magic"
  | "support"

export function classifyAction(
  abilityId: string,
  effectKinds: string[]
): PresentationActionKind {
  if (effectKinds.includes("heal")) return "support"

  if (PHYSICAL_ABILITIES.has(abilityId)) {
    return "physical"
  }

  if (
    MAGIC_ABILITIES.test(abilityId) ||
    effectKinds.includes("applyStatus")
  ) {
    return "magic"
  }

  return "physical"
}
