export type TagCategory =
  | "origin"
  | "species"
  | "combat"
  | "element"
  | "role"
  | "alignment"
  | "state"
  | "evolution"

export type TagMetadata = {
  name: string
  category: TagCategory
  description: string
}

export const TagRegistry = {
  Human: {
    name: "Human",
    category: "origin",
    description: "A mortal of the human race."
  },
  Nature: {
    name: "Nature",
    category: "origin",
    description: "Bound to the living world and its cycles."
  },
  Arcane: {
    name: "Arcane",
    category: "origin",
    description: "Draws power from raw magical forces."
  },
  Divine: {
    name: "Divine",
    category: "origin",
    description: "Power granted by gods or higher powers."
  },
  Infernal: {
    name: "Infernal",
    category: "origin",
    description: "Power drawn from the lower realms."
  },
  Astral: {
    name: "Astral",
    category: "origin",
    description: "Connected to stars, fate, and the beyond."
  },
  Primordial: {
    name: "Primordial",
    category: "origin",
    description: "Bears the power of the world's first forces."
  },

  Beast: {
    name: "Beast",
    category: "species",
    description: "A creature driven by instinct."
  },
  Dragon: {
    name: "Dragon",
    category: "species",
    description: "A draconic being of ancient power."
  },
  Elf: {
    name: "Elf",
    category: "species",
    description: "A long-lived child of the forest."
  },
  Dwarf: {
    name: "Dwarf",
    category: "species",
    description: "A stout and resilient mountain dweller."
  },
  Fairy: {
    name: "Fairy",
    category: "species",
    description: "A small being of nature magic."
  },
  Goblin: {
    name: "Goblin",
    category: "species",
    description: "A cunning and troublesome creature."
  },
  Orc: {
    name: "Orc",
    category: "species",
    description: "A hardy warrior of the wilds."
  },
  Troll: {
    name: "Troll",
    category: "species",
    description: "A tough creature with quick regeneration."
  },
  Undead: {
    name: "Undead",
    category: "species",
    description: "Animated beyond death."
  },
  Spirit: {
    name: "Spirit",
    category: "species",
    description: "A being of pure ethereal essence."
  },
  Elemental: {
    name: "Elemental",
    category: "species",
    description: "Living manifestation of an element."
  },
  Construct: {
    name: "Construct",
    category: "species",
    description: "An artificial being given motion."
  },
  Demon: {
    name: "Demon",
    category: "species",
    description: "A hostile inhabitant of the lower realms."
  },
  Angel: {
    name: "Angel",
    category: "species",
    description: "A celestial servant of the divine."
  },
  Slime: {
    name: "Slime",
    category: "species",
    description: "A shapeless and resilient creature."
  },
  Wolf: {
    name: "Wolf",
    category: "species",
    description: "A pack hunter."
  },
  Giant: {
    name: "Giant",
    category: "species",
    description: "A being of immense size and strength."
  },
  Machine: {
    name: "Machine",
    category: "species",
    description: "A created engine of war or labor."
  },

  Melee: {
    name: "Melee",
    category: "combat",
    description: "Fights at close range."
  },
  Ranged: {
    name: "Ranged",
    category: "combat",
    description: "Fights from a distance."
  },
  Buff: {
    name: "Buff",
    category: "combat",
    description: "Strengthens allies."
  },
  Debuff: {
    name: "Debuff",
    category: "combat",
    description: "Weakens enemies."
  },
  Tank: {
    name: "Tank",
    category: "combat",
    description: "Absorbs damage for the party."
  },
  Stealth: {
    name: "Stealth",
    category: "combat",
    description: "Relies on concealment and surprise."
  },
  Crit: {
    name: "Crit",
    category: "combat",
    description: "Specializes in critical strikes."
  },
  Counter: {
    name: "Counter",
    category: "combat",
    description: "Punishes enemy aggression."
  },
  AoE: {
    name: "AoE",
    category: "combat",
    description: "Affects groups rather than single targets."
  },
  DoT: {
    name: "DoT",
    category: "combat",
    description: "Inflicts damage over time."
  },
  Burst: {
    name: "Burst",
    category: "combat",
    description: "Front-loads damage in a single strike."
  },
  Sustained: {
    name: "Sustained",
    category: "combat",
    description: "Excels in long fights."
  },
  Mobile: {
    name: "Mobile",
    category: "combat",
    description: "Moves quickly around the field."
  },
  Summoner: {
    name: "Summoner",
    category: "combat",
    description: "Fights through summoned creatures."
  },
  Summoning: {
    name: "Summoning",
    category: "combat",
    description: "Gains power from calling allies."
  },
  Curse: {
    name: "Curse",
    category: "combat",
    description: "Uses harmful magic on enemies."
  },

  Fire: {
    name: "Fire",
    category: "element",
    description: "Wields flames and heat."
  },
  Ice: {
    name: "Ice",
    category: "element",
    description: "Wields cold and frost."
  },
  Lightning: {
    name: "Lightning",
    category: "element",
    description: "Wields storms and electricity."
  },
  Water: {
    name: "Water",
    category: "element",
    description: "Commands water and tides."
  },
  Earth: {
    name: "Earth",
    category: "element",
    description: "Commands stone and soil."
  },
  Wind: {
    name: "Wind",
    category: "element",
    description: "Commands air and gales."
  },
  Poison: {
    name: "Poison",
    category: "element",
    description: "Uses toxins and venom."
  },
  Holy: {
    name: "Holy",
    category: "element",
    description: "Channels sacred light."
  },
  Dark: {
    name: "Dark",
    category: "element",
    description: "Channels darkness and void."
  },
  Shadow: {
    name: "Shadow",
    category: "element",
    description: "Hides within darkness."
  },
  Blood: {
    name: "Blood",
    category: "element",
    description: "Draws power from life force."
  },
  Void: {
    name: "Void",
    category: "element",
    description: "Wields emptiness and oblivion."
  },
  Solar: {
    name: "Solar",
    category: "element",
    description: "Channels the power of the sun."
  },
  Lunar: {
    name: "Lunar",
    category: "element",
    description: "Channels the power of the moon."
  },

  Fighter: {
    name: "Fighter",
    category: "role",
    description: "A straightforward combat specialist."
  },
  Healer: {
    name: "Healer",
    category: "role",
    description: "Restores allies and sustains the party."
  },
  Archer: {
    name: "Archer",
    category: "role",
    description: "A master of the bow."
  },
  Spellcaster: {
    name: "Spellcaster",
    category: "role",
    description: "Casts magical spells."
  },
  Support: {
    name: "Support",
    category: "role",
    description: "Enhances the party's effectiveness."
  },
  Regen: {
    name: "Regen",
    category: "role",
    description: "Specializes in restoration over time."
  },
  Assassin: {
    name: "Assassin",
    category: "role",
    description: "Eliminates targets swiftly."
  },
  Shaman: {
    name: "Shaman",
    category: "role",
    description: "Mediates between the physical and spiritual."
  },
  Druid: {
    name: "Druid",
    category: "role",
    description: "A nature-focused spellcaster."
  },
  Bard: {
    name: "Bard",
    category: "role",
    description: "Inspires allies through song or story."
  },
  Paladin: {
    name: "Paladin",
    category: "role",
    description: "A holy guardian."
  },
  Berserker: {
    name: "Berserker",
    category: "role",
    description: "Fights in a relentless rage."
  },

  HolyAligned: {
    name: "Holy Aligned",
    category: "alignment",
    description: "Follows a righteous path."
  },
  Corrupt: {
    name: "Corrupt",
    category: "alignment",
    description: "Twisted by forbidden power."
  },
  Fallen: {
    name: "Fallen",
    category: "alignment",
    description: "Cast out from a former grace."
  },
  Pure: {
    name: "Pure",
    category: "alignment",
    description: "Untouched by corruption."
  },
  Neutral: {
    name: "Neutral",
    category: "alignment",
    description: "Unbound by moral extremes."
  },

  Flying: {
    name: "Flying",
    category: "state",
    description: "Airborne and hard for melee foes to reach."
  },
  Armored: {
    name: "Armored",
    category: "state",
    description: "Protected by heavy defenses."
  },
  Mounted: {
    name: "Mounted",
    category: "state",
    description: "Fights from a mount."
  },
  Tiny: {
    name: "Tiny",
    category: "state",
    description: "Exceptionally small."
  },
  Large: {
    name: "Large",
    category: "state",
    description: "Exceptionally large."
  },
  Ethereal: {
    name: "Ethereal",
    category: "state",
    description: "Partly outside the physical world."
  },
  Elite: {
    name: "Elite",
    category: "state",
    description: "A cut above ordinary enemies."
  },
  Boss: {
    name: "Boss",
    category: "state",
    description: "A major encounter."
  },
  Enraged: {
    name: "Enraged",
    category: "state",
    description: "Empowered by anger."
  },
  Rooted: {
    name: "Rooted",
    category: "state",
    description: "Fixed in place."
  },

  Lich: {
    name: "Lich",
    category: "evolution",
    description: "An undead master of arcane magic."
  },
  Sorcerer: {
    name: "Sorcerer",
    category: "evolution",
    description: "A spontaneous channeler of raw magic."
  },
  Necromancer: {
    name: "Necromancer",
    category: "evolution",
    description: "A master of death and summoned minions."
  },
  GhostMage: {
    name: "Ghost Mage",
    category: "evolution",
    description: "A spectral spellcaster."
  },
  SpellWeaver: {
    name: "Spell Weaver",
    category: "evolution",
    description: "A weaver of intricate magical effects."
  },
  Archmage: {
    name: "Archmage",
    category: "evolution",
    description: "A peerless master of the arcane."
  },
  Ifrit: {
    name: "Ifrit",
    category: "evolution",
    description: "A summoned lord of fire."
  },
  Shiva: {
    name: "Shiva",
    category: "evolution",
    description: "A summoned lord of ice."
  },
  Bahamut: {
    name: "Bahamut",
    category: "evolution",
    description: "A legendary draconic summon."
  },
  Warlock: {
    name: "Warlock",
    category: "evolution",
    description: "A caster bound to a darker patron."
  },
  Ranger: {
    name: "Ranger",
    category: "evolution",
    description: "A scout and beast hunter."
  }
} as const satisfies Record<string, TagMetadata>

export type HeroTag = keyof typeof TagRegistry

export const HeroTags =
  Object.keys(TagRegistry) as HeroTag[]

export function isHeroTag(
  tag: string
): tag is HeroTag {
  return tag in TagRegistry
}

export function getTagMetadata(
  tag: string
): TagMetadata | undefined {
  return isHeroTag(tag)
    ? TagRegistry[tag]
    : undefined
}

export function getTagsByCategory(
  category: TagCategory
): HeroTag[] {
  return HeroTags.filter(
    tag =>
      TagRegistry[tag].category ===
      category
  )
}
