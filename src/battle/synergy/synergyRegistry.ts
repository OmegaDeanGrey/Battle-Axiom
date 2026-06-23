export const SynergyRegistry = [

  // ======================
  // CURRENT TAG SYNERGIES
  // ======================


  {
    id: "human_unity",

    name: "Human Unity",

    tags: [
      "Human"
    ],

    threshold: 2,

    description:
      "Humans fighting together strengthen each other.",

    bonus: {
      type: "defense",
      value: 5
    }

  },


  {
    id: "nature_balance",

    name: "Nature Balance",

    tags: [
      "Nature"
    ],

    threshold: 2,

    description:
      "Nature allies improve regeneration.",

    bonus: {
      type: "regen",
      value: 10
    }

  },


  {
    id: "arcane_convergence",

    name: "Arcane Convergence",

    tags: [
      "Arcane"
    ],

    threshold: 2,

    description:
      "Arcane users amplify magical power.",

    bonus: {
      type: "magicDamage",
      value: 5
    }

  },


  {
    id: "melee_formation",

    name: "Melee Formation",

    tags: [
      "Melee"
    ],

    threshold: 2,

    description:
      "Close-range fighters reinforce each other's aggression.",

    bonus: {
      type: "physicalDamage",
      value: 5
    }

  },


  {
    id: "ranged_precision",

    name: "Ranged Precision",

    tags: [
      "Ranged"
    ],

    threshold: 2,

    description:
      "Ranged allies improve accuracy and critical strikes.",

    bonus: {
      type: "critChance",
      value: 5
    }

  },


  {
    id: "buff_resonance",

    name: "Buff Resonance",

    tags: [
      "Buff"
    ],

    threshold: 2,

    description:
      "Supportive abilities become stronger when allies empower each other.",

    bonus: {
      type: "buffPower",
      value: 5
    }

  },


  // ======================
  // FUTURE EVOLUTION TAGS
  // ======================


  {
    id: "dark_arts",

    name: "Dark Arts",

    tags: [
      "Arcane",
      "Curse"
    ],

    threshold: 2,

    description:
      "Forbidden magic strengthens harmful effects.",

    bonus: {
      type: "statusPower",
      value: 10
    }

  },


  {
    id: "holy_guardians",

    name: "Holy Guardians",

    tags: [
      "Holy",
      "Buff"
    ],

    threshold: 2,

    description:
      "Holy allies empower healing and protective abilities.",

    bonus: {
      type: "healing",
      value: 10
    }

  },


  {
    id: "battle_line",

    name: "Battle Line",

    tags: [
      "Tank",
      "Melee"
    ],

    threshold: 2,

    description:
      "Frontline fighters become harder to defeat.",

    bonus: {
      type: "defense",
      value: 10
    }

  },


  {
    id: "shadow_assault",

    name: "Shadow Assault",

    tags: [
      "Stealth",
      "Ranged"
    ],

    threshold: 2,

    description:
      "Hidden attackers exploit enemy weaknesses.",

    bonus: {
      type: "critDamage",
      value: 10
    }

  },


  {
    id: "summoners_circle",

    name: "Summoner's Circle",

    tags: [
      "Summoner"
    ],

    threshold: 2,

    description:
      "Summoners strengthen their summoned allies.",

    bonus: {
      type: "summonPower",
      value: 10
    }

  },


  {
    id: "dragon_bond",

    name: "Dragon Bond",

    tags: [
      "Dragon"
    ],

    threshold: 2,

    description:
      "Dragon allies unleash their natural power.",

    bonus: {
      type: "damage",
      value: 5
    }

  }

]