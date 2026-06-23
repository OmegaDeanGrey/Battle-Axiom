import type { Unit } from "../../models/unit"
import witchPortrait
from "../../../assets/heroes/Witch.png"
import { BasicAttack } from "../../abilities/basicAttack"

export function createWitch(): Unit {
  return {
    id: crypto.randomUUID(),
          name: "Witch",
          heroClass:"Witch",
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
          description: "A practitioner of mysterious and unconventional magic who explores powers others fear to understand. Witches grow through knowledge of curses, spirits, and hidden forces, shaping their own approach to magic.",
          portrait: witchPortrait,
          tags: ["Arcane", "Buff"]
        }
    }