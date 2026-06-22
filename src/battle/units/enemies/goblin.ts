// enemies/goblin.ts

import type { Unit }
from "../../models/unit"

import { BasicAttack }
from "../../abilities/basicAttack"

export function createGoblin(): Unit {
  return {
    id: crypto.randomUUID(),

    name: "Goblin",
    heroClass: "Goblin",
    hp: 100,
    maxHp: 100,

    attack: 15,
    defense: 15,
    critChance: 0.10,
    critMultiplier: 2,
    damageVariance: 0.10,
    speed: 20,

    timeline: 0,

    level: 1,
    xp: 0,
    skillPoints: 0,

    abilities: [BasicAttack],

    passives: [],

    skillTree: [],

    team: "enemy",

    statuses: [],

    portrait: "goblinPortrait",

    tags: ["Goblin"]
  }
}