import {
  createBattle,
  tickBattle
} from "../engine/battleEngine"
import { createKnight } from "../units/heroes/knight"
import { createGoblin } from "../units/enemies/goblin"

const battle = createBattle([
  createKnight(),
  createGoblin()
])

for (let i = 0; i < 20; i++) {
  tickBattle(battle)
}

console.log("Battle Log:")
console.log(battle.log)
