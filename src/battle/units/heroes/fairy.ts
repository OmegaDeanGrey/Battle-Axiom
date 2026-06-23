import type { Unit } from "../../models/unit"
import fairyPortrait
from "../../../assets/heroes/Fairy.png"
import { BasicAttack } from "../../abilities/basicAttack"

export function createFairy(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Fairy",
          heroClass:"Fairy",
          hp: 70,
          maxHp: 70,
          attack: 10,
          defense: 25,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 25,
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
          description: "A magical being connected to the forces of nature and restoration. Fairies combine healing, growth, and mystical power, with their evolution shaped by the balance between nurturing life and wielding magic.",
          portrait: fairyPortrait,
          tags: ["Nature", "Buff", "Flying"]
        }
    }