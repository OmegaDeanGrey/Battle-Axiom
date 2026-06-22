import type { Unit } from "../../models/unit"
import priestPortrait
from "../../../assets/heroes/Priest.png"
import { BasicAttack } from "../../abilities/basicAttack"

export function createPriest(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Priest",
          heroClass:"Priest",
          hp: 90,
          maxHp: 90,
          attack: -10,
          defense: 20,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 15,
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
          portrait: priestPortrait,
          tags: ["Human", "Buff"]
        }
    }