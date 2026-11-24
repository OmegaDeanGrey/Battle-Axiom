export type RelicId =
  | "amethystBrooch"
  | "leatherBracers"
  | "ancientHelm"
  | "twellianStone"

export interface Relic {
  id: RelicId
  name: string
  description: string
  price: number
  image: string
  type: "accessory" | "armor" | "helmet" | "weapon"
  rarity: "common" | "uncommon" | "rare" | "legendary"
  stats: {
    defense?: number
    attack?: number
    speed?: number
    regeneration?: number
    mystery?: string
  }
}

export function isRelicId(
  value: string
): value is RelicId {
  return Object.prototype.hasOwnProperty.call(
    RelicRegistry,
    value
  )
}

export const RelicRegistry: Record<RelicId, Relic> = {
  amethystBrooch: {
    id: "amethystBrooch",
    name: "Amethyst Brooch",
    description:
      "An old silver brooch set with a deep purple amethyst. Its enchantment offers protection against hostile magic.",
    price: 11050,
    image: "/AmethystBrooch.png",
    type: "accessory",
    rarity: "rare",
    stats: {
      mystery: "???",
    },
  },
  leatherBracers: {
    id: "leatherBracers",
    name: "Leather Bracers",
    description:
      "A sturdy pair of reinforced leather bracers, worn smooth by years of use.",
    price: 100,
    image: "/LeatherBracers.png",
    type: "armor",
    rarity: "common",
    stats: {
      speed: +2,
    },
  },

  ancientHelm: {
    id: "ancientHelm",
    name: "Ancient Helm",
    description:
      "A weathered steel helm bearing the markings of a forgotten kingdom.",
    price: 250,
    image: "/AncientHelm.png",
    type: "helmet",
    rarity: "uncommon",
    stats: {
      defense: 8,
    },
  },

    twellianStone: {
    id: "twellianStone",
    name: "Twellian Stone",
    description:
      "A weathered stone emanating warmth.",
    price: 250,
    image: "/TwellianStone.png",
    type: "helmet",
    rarity: "uncommon",
    stats: {
      defense: 8,
    },
  },
}