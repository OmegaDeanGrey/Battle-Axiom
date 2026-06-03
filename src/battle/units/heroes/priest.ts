import type { Unit } from "../../models/unit"

import { PoisonStrike }
from "../../abilities/poisonStrike"

import { Claw }
from "../../abilities/claw"

export function createPriest(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Priest",
          hp: 90,
          maxHp: 90,
          attack: -10,
          defense: 20,
          speed: 15,
          timeline: 0,
          level: 1,
          xp: 0,
          skillPoints: 0,
          abilities: [PoisonStrike, Claw],
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
          tags: ["Human"]
        }
    }