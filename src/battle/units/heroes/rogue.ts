import type { Unit } from "../../models/unit"
import roguePortrait
from "../../../assets/heroes/Rogue.png"
import { BasicAttack } from "../../abilities/basicAttack"

export function createRogue(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Rogue",
          heroClass:"Rogue",
          hp: 75,
          maxHp: 75,
          attack: 20,
          defense: 15,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 30,
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
          description: "A clever and adaptable fighter who relies on speed, precision, and opportunity. Rogues learn to exploit weaknesses and can develop into masters of stealth, deception, or deadly combat techniques.",
          portrait: roguePortrait,
          tags: ["Human", "Ranged"]
        }
    }