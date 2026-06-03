import type { Unit } from "../../models/unit"

import { PoisonStrike }
from "../../abilities/poisonStrike"

import { Claw }
from "../../abilities/claw"

export function createWolf(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Wolf",
          hp: 100,
          maxHp: 100,
          attack: 20,
          defense: 25,
          speed: 30,
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
          tags: ["Beast"]
        }
    }