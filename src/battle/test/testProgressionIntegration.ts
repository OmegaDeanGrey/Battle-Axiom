import type { Unit } from "../models/unit"
import type { BattleState } from "../engine/battleEngine"
import {
  createBattle
} from "../engine/battleEngine"
import {
  checkVictory
} from "../engine/checkVictory"
import {
  commitBattleProgress
} from "../progression/commitBattleProgress"
import {
  applyRewardProgressToUnits,
  resolveHeroRewardProgress
} from "../progression/resolveBattleOutcome"
import {
  unlockSkill
} from "../progression/unlockSkill"
import {
  createKnight
} from "../units/heroes/knight"
import {
  createPriest
} from "../units/heroes/priest"
import {
  createGoblin
} from "../units/enemies/goblin"

let failures = 0

function check(
  name: string,
  condition: boolean
) {
  if (condition) {
    console.log(`PASS: ${name}`)
  } else {
    failures += 1
    console.error(`FAIL: ${name}`)
  }
}

function updateHero(
  heroes: Unit[],
  heroId: string,
  updater: (hero: Unit) => Unit
): Unit[] {
  const hero =
    heroes.find(h => h.id === heroId)

  if (!hero) return heroes

  const updated = updater(
    structuredClone(hero)
  )

  return heroes.map(h =>
    h.id === heroId ? updated : h
  )
}

const knight = createKnight()
const priest = createPriest()
knight.xp = 90
const party = [knight, priest]

const battleUnits: Unit[] = [
  ...party.map(hero =>
    structuredClone(hero)
  ),
  createGoblin()
]

battleUnits[0].xp = knight.xp

const battle = createBattle(battleUnits)

const enemy = battle.units.find(
  unit => unit.team === "enemy"
)!

enemy.hp = 0
checkVictory(battle)

check(
  "victory sets winner to player",
  battle.winner === "player"
)

const heroProgress =
  resolveHeroRewardProgress(
    party,
    battle.units,
    50
  )

const finalUnits =
  applyRewardProgressToUnits(
    battle.units,
    heroProgress
  )

const resolvedKnight =
  heroProgress.find(
    row => row.id === knight.id
  )!

check(
  "authoritative reward grants XP to the resolved result",
  resolvedKnight.xp === 40 &&
    resolvedKnight.level === 2 &&
    resolvedKnight.skillPointsGained === 1
)

let contextParty =
  commitBattleProgress(
    party,
    finalUnits
  )

const recruitedHeroes =
  commitBattleProgress(
    party,
    finalUnits
  )

const committedKnight =
  contextParty.find(
    hero => hero.id === knight.id
  )!

const committedPriest =
  contextParty.find(
    hero => hero.id === priest.id
  )!

check(
  "XP persists in committed party state",
  committedKnight.xp === 40
)

check(
  "level increase is retained",
  committedKnight.level === 2 &&
    committedKnight.maxHp === 134 &&
    committedKnight.speed === 11
)

check(
  "earned skill point remains available",
  committedKnight.skillPoints === 1
)

check(
  "recruited roster receives same progression",
  recruitedHeroes.find(
    hero => hero.id === knight.id
  )?.xp === 40
)

check(
  "other party member gets only its own rewards",
  committedPriest.xp === 50 &&
    committedPriest.level === 1 &&
    committedPriest.skillPoints === 0 &&
    committedPriest.maxHp === 90 &&
    committedPriest.name === priest.name &&
    committedPriest.heroClass === priest.heroClass &&
    committedPriest.abilities.length ===
      priest.abilities.length
)

let commitCount = 0
let rewardsCommitted = false

function handleBattleEnd(
  finished: BattleState
) {
  if (rewardsCommitted) return
  if (finished.winner !== "player") return

  rewardsCommitted = true
  commitCount += 1

  contextParty =
    commitBattleProgress(
      contextParty,
      finalUnits
    )
}

const beforeDuplicate =
  structuredClone(contextParty)

handleBattleEnd(battle)
handleBattleEnd(battle)

check(
  "completion callback commits only once",
  commitCount === 1
)

check(
  "duplicate commit leaves progression unchanged",
  JSON.stringify(contextParty) ===
    JSON.stringify(beforeDuplicate)
)

const priestBeforeUnlock =
  structuredClone(committedPriest)

contextParty = updateHero(
  contextParty,
  knight.id,
  hero => {
    unlockSkill(hero, "sword_strike")
    return hero
  }
)

const afterUnlockKnight =
  contextParty.find(
    hero => hero.id === knight.id
  )!

const afterUnlockPriest =
  contextParty.find(
    hero => hero.id === priest.id
  )!

check(
  "skill point spending updates correct hero",
  afterUnlockKnight.skillPoints === 0 &&
    afterUnlockKnight.skillTree.find(
      node => node.id === "sword_strike"
    )?.rank === 1
)

check(
  "skill unlock does not change other heroes",
  JSON.stringify(afterUnlockPriest) ===
    JSON.stringify(priestBeforeUnlock)
)

const defeatedParty = [
  createKnight(),
  createPriest()
]

const defeatBattle = createBattle([
  ...defeatedParty.map(hero =>
    structuredClone(hero)
  ),
  createGoblin()
])

for (const unit of defeatBattle.units) {
  if (unit.team === "player") {
    unit.hp = 0
  }
}

checkVictory(defeatBattle)

const defeatedKnight =
  defeatBattle.units.find(
    unit =>
      unit.id === defeatedParty[0].id
  )!

check(
  "defeat sets winner to enemy",
  defeatBattle.winner === "enemy"
)

check(
  "defeat grants no XP or skill points",
  defeatedKnight.xp === 0 &&
    defeatedKnight.level === 1 &&
    defeatedKnight.skillPoints === 0
)

const afterDefeat =
  commitBattleProgress(
    defeatedParty,
    defeatBattle.units
  )

check(
  "defeat leaves permanent progression unchanged",
  afterDefeat.every(hero =>
    hero.xp === 0 &&
      hero.level === 1 &&
      hero.skillPoints === 0
  )
)

if (failures > 0) {
  throw new Error(
    `${failures} progression check(s) failed`
  )
}

console.log(
  "All progression integration checks passed"
)
