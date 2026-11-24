import type {
  SkillNodeTemplate
} from "../models/skillNode"

export const SkillTreeRegistry:
  Record<string, SkillNodeTemplate[]> = {

  Knight: [
    {
      id: "sword_strike",
      name: "Sword Strike",
      description: "A disciplined strike that grows stronger with each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Blade",
      effect: {
        type: "ability",
        abilityId: "sword_strike",
        rankedAbilityIds: [
          "sword_strike",
          "sword_strike_ii",
          "sword_strike_iii"
        ]
      }
    },
    {
      id: "shield_bash",
      name: "Shield Bash",
      description: "A crushing blow with the shield.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Blade",
      requires: ["sword_strike"],
      effect: {
        type: "ability",
        abilityId: "shield_bash"
      }
    },
    {
      id: "knight_vitality",
      name: "Iron Will",
      description: "Increases maximum HP. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Guard",
      effect: {
        type: "stat",
        stat: "maxHp",
        value: 10,
        perRank: 5
      }
    },
    {
      id: "knight_guard",
      name: "Steady Stance",
      description: "Increases defense. Scaling improves each rank.",
      cost: 2,
      maxRank: 2,
      minLevel: 4,
      tier: 3,
      branch: "Guard",
      requires: ["knight_vitality"],
      effect: {
        type: "stat",
        stat: "defense",
        value: 5,
        perRank: 3
      }
    }
  ],

  Priest: [
    {
      id: "holy_light",
      name: "Holy Light",
      description: "Restores an ally's HP. Higher ranks restore more.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Grace",
      effect: {
        type: "ability",
        abilityId: "holy_light",
        rankedAbilityIds: [
          "holy_light",
          "holy_light_ii",
          "holy_light_ii"
        ]
      }
    },
    {
      id: "smite",
      name: "Smite",
      description: "Strikes an enemy with divine force.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Judgment",
      requires: ["holy_light"],
      effect: {
        type: "ability",
        abilityId: "smite"
      }
    },
    {
      id: "priest_resolve",
      name: "Resolved Faith",
      description: "Increases maximum HP. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Grace",
      effect: {
        type: "stat",
        stat: "maxHp",
        value: 8,
        perRank: 4
      }
    },
    {
      id: "priest_aegis",
      name: "Sacred Aegis",
      description: "Increases defense. Scaling improves each rank.",
      cost: 2,
      maxRank: 2,
      minLevel: 4,
      tier: 3,
      branch: "Grace",
      requires: ["priest_resolve"],
      effect: {
        type: "stat",
        stat: "defense",
        value: 5,
        perRank: 3
      }
    }
  ],

  Rogue: [
    {
      id: "shadow_stab",
      name: "Shadow Stab",
      description: "A precise strike that deepens with each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Shadows",
      effect: {
        type: "ability",
        abilityId: "shadow_stab",
        rankedAbilityIds: [
          "shadow_stab",
          "shadow_stab_ii",
          "shadow_stab_ii"
        ]
      }
    },
    {
      id: "venom_edge",
      name: "Venom Edge",
      description: "Poisons the target on impact.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Shadows",
      effect: {
        type: "ability",
        abilityId: "poison_strike"
      }
    },
    {
      id: "rogue_reflexes",
      name: "Quick Reflexes",
      description: "Increases speed. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Footwork",
      effect: {
        type: "stat",
        stat: "speed",
        value: 3,
        perRank: 2
      }
    },
    {
      id: "backstab",
      name: "Backstab",
      description: "A devastating follow-up strike.",
      cost: 2,
      maxRank: 1,
      minLevel: 4,
      tier: 3,
      branch: "Shadows",
      requires: ["shadow_stab"],
      effect: {
        type: "ability",
        abilityId: "backstab"
      }
    }
  ],

  "Baby Dragon": [
    {
      id: "dragon_breath",
      name: "Dragon Breath",
      description: "A growing inferno. Higher ranks deal more damage.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Draconic",
      effect: {
        type: "ability",
        abilityId: "dragon_breath",
        rankedAbilityIds: [
          "dragon_breath",
          "dragon_breath_ii",
          "dragon_breath_ii"
        ]
      }
    },
    {
      id: "talons",
      name: "Talons",
      description: "A swift raking attack.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Draconic",
      effect: {
        type: "ability",
        abilityId: "claw"
      }
    },
    {
      id: "dragon_growth",
      name: "Ancient Growth",
      description: "Increases attack. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Growth",
      effect: {
        type: "stat",
        stat: "attack",
        value: 4,
        perRank: 3
      }
    },
    {
      id: "tail_sweep",
      name: "Tail Sweep",
      description: "A heavy sweeping strike.",
      cost: 2,
      maxRank: 1,
      minLevel: 4,
      tier: 3,
      branch: "Draconic",
      requires: ["dragon_breath"],
      effect: {
        type: "ability",
        abilityId: "tail_sweep"
      }
    }
  ],

  Fairy: [
    {
      id: "mend",
      name: "Mend",
      description: "Restores an ally's HP. Higher ranks restore more.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Restoration",
      effect: {
        type: "ability",
        abilityId: "mend",
        rankedAbilityIds: [
          "mend",
          "mend_ii",
          "mend_ii"
        ]
      }
    },
    {
      id: "life_bloom",
      name: "Life Bloom",
      description: "A gentle restorative bloom.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Restoration",
      effect: {
        type: "ability",
        abilityId: "life_bloom"
      }
    },
    {
      id: "fairy_grace",
      name: "Fairy Grace",
      description: "Increases maximum HP. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Restoration",
      effect: {
        type: "stat",
        stat: "maxHp",
        value: 6,
        perRank: 3
      }
    },
    {
      id: "fairy_flight",
      name: "Light Wings",
      description: "Increases speed. Scaling improves each rank.",
      cost: 2,
      maxRank: 2,
      minLevel: 4,
      tier: 3,
      branch: "Flight",
      requires: ["fairy_grace"],
      effect: {
        type: "stat",
        stat: "speed",
        value: 4,
        perRank: 2
      }
    }
  ],

  "Elven Ranger": [
    {
      id: "bullseye",
      name: "Bullseye",
      description: "A precise shot that improves with each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Archery",
      effect: {
        type: "ability",
        abilityId: "bullseye",
        rankedAbilityIds: [
          "bullseye",
          "bullseye",
          "bullseye"
        ]
      }
    },
    {
      id: "feather_flight",
      name: "Feather Flight",
      description: "A quick arrow carried by the wind.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Archery",
      effect: {
        type: "ability",
        abilityId: "feather_flight"
      }
    },
    {
      id: "ranger_agility",
      name: "Woodland Agility",
      description: "Increases speed. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Wilds",
      effect: {
        type: "stat",
        stat: "speed",
        value: 3,
        perRank: 2
      }
    },
    {
      id: "falcon",
      name: "Falcon Dive",
      description: "Calls a falcon to strike from above.",
      cost: 2,
      maxRank: 1,
      minLevel: 4,
      tier: 3,
      branch: "Wilds",
      requires: ["bullseye"],
      effect: {
        type: "ability",
        abilityId: "falcon"
      }
    }
  ],

  Mage: [
    {
      id: "fire_bolt",
      name: "Fire Bolt",
      description: "A basic flame spell that grows in power.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Fire",
      effect: {
        type: "ability",
        abilityId: "fire_bolt",
        rankedAbilityIds: [
          "fire_bolt",
          "fire_bolt_ii",
          "fire_bolt_ii"
        ]
      }
    },
    {
      id: "frost_bolt",
      name: "Frost Bolt",
      description: "A chilling spell.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Ice",
      effect: {
        type: "ability",
        abilityId: "frost_bolt"
      }
    },
    {
      id: "arcane_power",
      name: "Arcane Power",
      description: "Increases attack. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Arcane",
      effect: {
        type: "stat",
        stat: "attack",
        value: 5,
        perRank: 3
      }
    },
    {
      id: "lightning",
      name: "Lightning",
      description: "Calls down a bolt of energy.",
      cost: 2,
      maxRank: 1,
      minLevel: 4,
      tier: 3,
      branch: "Lightning",
      requires: ["fire_bolt"],
      effect: {
        type: "ability",
        abilityId: "lightning"
      }
    }
  ],

  Witch: [
    {
      id: "hex",
      name: "Hex",
      description: "Damages and afflicts the target. Higher ranks hurt more.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Curses",
      effect: {
        type: "ability",
        abilityId: "hex",
        rankedAbilityIds: [
          "hex",
          "hex_ii",
          "hex_ii"
        ]
      }
    },
    {
      id: "weaken",
      name: "Weaken",
      description: "Saps the target with dark magic.",
      cost: 1,
      maxRank: 1,
      minLevel: 2,
      tier: 2,
      branch: "Curses",
      effect: {
        type: "ability",
        abilityId: "weaken"
      }
    },
    {
      id: "witch_knowledge",
      name: "Forbidden Knowledge",
      description: "Increases attack. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Curses",
      effect: {
        type: "stat",
        stat: "attack",
        value: 4,
        perRank: 2
      }
    },
    {
      id: "witch_venom",
      name: "Venom Curse",
      description: "Adds poison damage to attacks.",
      cost: 2,
      maxRank: 1,
      minLevel: 4,
      tier: 3,
      branch: "Curses",
      requires: ["hex"],
      effect: {
        type: "ability",
        abilityId: "poison_strike"
      }
    }
  ],

  Summoner: [
    {
      id: "spirit_wolf",
      name: "Spirit Wolf",
      description: "Calls a spirit to rend the enemy. Higher ranks hit harder.",
      cost: 1,
      maxRank: 3,
      minLevel: 1,
      tier: 1,
      branch: "Summoning",
      effect: {
        type: "ability",
        abilityId: "spirit_wolf",
        rankedAbilityIds: [
          "spirit_wolf",
          "spirit_wolf_ii",
          "spirit_wolf_ii"
        ]
      }
    },
    {
      id: "summoner_vigor",
      name: "Shared Vigor",
      description: "Increases maximum HP. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Bond",
      effect: {
        type: "stat",
        stat: "maxHp",
        value: 8,
        perRank: 4
      }
    },
    {
      id: "summoner_focus",
      name: "Summoning Focus",
      description: "Increases attack. Scaling improves each rank.",
      cost: 1,
      maxRank: 3,
      minLevel: 2,
      tier: 2,
      branch: "Bond",
      effect: {
        type: "stat",
        stat: "attack",
        value: 3,
        perRank: 2
      }
    },
    {
      id: "ifrit",
      name: "Ifrit",
      description: "Summons a lord of flame.",
      cost: 2,
      maxRank: 1,
      minLevel: 4,
      tier: 3,
      branch: "Summoning",
      requires: ["spirit_wolf"],
      effect: {
        type: "ability",
        abilityId: "ifrit"
      }
    }
  ]
}

export function getSkillTreeRegistryKeys() {
  return Object.keys(SkillTreeRegistry)
}
