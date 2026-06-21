import type { Unit } from "../../models/unit"
import knightPortrait
from "../../../assets/heroes/Knight.png"
import { PoisonStrike }
from "../../abilities/poisonStrike"

import { Claw }
from "../../abilities/claw"

export function createKnight(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Knight",
          hp: 120,
          maxHp: 120,
          attack: 25,
          defense: 25,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 10,
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
          portrait: knightPortrait,
          tags: ["Human", "Melee"]
        }
    }