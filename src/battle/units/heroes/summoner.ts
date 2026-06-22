import type { Unit } from "../../models/unit"
import summonerPortrait
from "../../../assets/heroes/Summoner.png"
import { BasicAttack } from "../../abilities/basicAttack"

export function createSummoner(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Summoner",
          heroClass:"Summoner",
          hp: 70,
          maxHp: 70,
          attack: 15,
          defense: 15,
          critChance: 0.10,
          critMultiplier: 2,
          damageVariance: 0.15,
          speed: 20,
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
          portrait: summonerPortrait,
          tags: ["Arcane", "Melee"]
        }
    }