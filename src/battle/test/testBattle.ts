import { createBattle, tickBattle } from "../engine/battleEngine"
import type { Unit } from "../models/unit"
import { BasicAttack } from "../abilities/basicAttack"

const units: Unit[] = [
  {
    id: "1",
    name: "Wolf",
    hp: 100,
    maxHp: 100,
    speed: 30,
    timeline: 0,
    abilities: [BasicAttack],
    team: "player",
    statuses: []
  },

  {
    id: "2",
    name: "Goblin",
    hp: 100,
    maxHp: 100,
    speed: 20,
    timeline: 0,
    abilities: [BasicAttack],
    team: "enemy",
    statuses: []
  }
]

const battle = createBattle(units)

for (let i = 0; i < 20; i++) {
  tickBattle(battle)
}

console.log("Battle Log:")
console.log(battle.log)