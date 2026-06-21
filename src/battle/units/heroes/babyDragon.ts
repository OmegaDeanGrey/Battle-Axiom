import type { Unit } from "../../models/unit"

import { BasicAttack } from "../../abilities/basicAttack"

export function createBabyDragon(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Baby Dragon",
          hp: 130,
          maxHp: 130,
          attack: 30,
          defense: 25,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 5,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [BasicAttack],
          passives: [],
          skillTree: [
            {
              id: "venom_bite",
              name: "Venom Bite",
              description: "Adds poison damage",
              cost: 1,
              unlocked: false,
              effect: {
                type: "ability",
                abilityId: "poison_strike"
              }
            },
            {
              id: "alpha_speed",
              name: "Alpha Reflexes",
              description: "+10 speed",
              cost: 1,
              unlocked: false,
              effect: {
                type: "stat",
                stat: "speed",
                value: 10
              }
            }
          ],
          team: "player",
          statuses: [],
          tags: ["Nature", "Melee"]
        }
    }