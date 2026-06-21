import { createKnight } from "../../battle/units/heroes/knight"
import { createPriest } from "../../battle/units/heroes/priest"
import { createRogue } from "../../battle/units/heroes/rogue"
import { createBabyDragon } from "../../battle/units/heroes/babyDragon"
import { createFairy } from "../../battle/units/heroes/fairy"
import { createElvenRanger } from "../../battle/units/heroes/elvenRanger"
import { createMage } from "../../battle/units/heroes/mage"
import { createWitch } from "../../battle/units/heroes/witch"
import { createSummoner } from "../../battle/units/heroes/summoner"



export const HeroRoster = [
  createKnight,
  createPriest,
  createRogue,
  createBabyDragon,
  createFairy,
  createElvenRanger,
  createMage,
  createWitch,
  createSummoner
]