import {
  createContext,
  useContext,
  useRef,
  useState
}
from "react"

import type { Unit }
from "../../battle/models/unit"

import type {
  ItemId
}
from "../data/ItemRegistry"

import type { RelicId } from "../data/RelicRegistry"
import {
  evaluatePurchase,
  type PurchaseReason
} from "../data/purchaseRules"
import type { Relationship } from "../../battle/models/relationship"
import {
  registerRelationshipMembers
} from "../../battle/relationships/relationshipPairs"
import {
  commitBattleProgress
} from "../../battle/progression/commitBattleProgress"
import type {
  BattleRewardResult
} from "../../battle/engine/rewards"
import type {
  HeroRewardProgress
} from "../../battle/progression/resolveBattleOutcome"

import {
  addCompletedScriptedEncounter,
  type CompletedScriptedEncounters
} from "../../battle/encounters/encounterProgress"

export type InventoryId = ItemId | RelicId

export type PurchaseOutcome =
  | { ok: true }
  | { ok: false; reason: PurchaseReason }

type Inventory =
  Partial<Record<InventoryId, number>>

export type BattleResult = {
  battleInstanceId: string
  locationId: string
  encounterId: string
  encounterName: string
  isScripted: boolean
  outcome: "victory" | "defeat"
  reward?: BattleRewardResult
  heroProgress: HeroRewardProgress[]
  finalUnits: Unit[]
  conclusion?: string
}

type GameContextType = {

  party: Unit[]

  setParty: (
    party: Unit[]
  ) => void

  updateHero: (
    heroId: string,
    updater: (hero: Unit) => Unit
  ) => void

  commitBattleResults: (
    battleUnits: Unit[]
  ) => void

  applyBattleResult: (
    result: BattleResult
  ) => void

  completedScriptedEncounters: CompletedScriptedEncounters

  completeScriptedEncounter: (
    locationId: string,
    encounterId: string
  ) => void

  gold: number

  setGold: (
    gold: number
  ) => void

  inventory: Inventory

  addItem: (
    itemId: InventoryId,
    quantity?: number
  ) => void

  removeItem: (
    itemId: InventoryId,
    quantity?: number
  ) => void

  purchase: (
    itemId: InventoryId,
    price: number,
    options?: { unique?: boolean }
  ) => PurchaseOutcome

  examinedObjects: string[]

  examineObject: (objectId: string) => void

  mayorRewardClaimed: boolean

    setMayorRewardClaimed: (
      claimed: boolean
    ) => void

  healParty: () => void

  sleepingQuartersUnlocked: boolean

  setSleepingQuartersUnlocked: (
    unlocked: boolean
  ) => void

  itemShopUnlocked: boolean

  setItemShopUnlocked: (
    unlocked: boolean
  ) => void

  mayorUnlocked: boolean

  setMayorUnlocked: (
    unlocked: boolean
  ) => void

  weaponShopUnlocked: boolean

  setWeaponShopUnlocked: (
    unlocked: boolean
  ) => void

  questBoardUnlocked: boolean

  setQuestBoardUnlocked: (
    unlocked: boolean
  ) => void

  windmillRowUnlocked: boolean

  setWindmillRowUnlocked: (
    unlocked: boolean
  ) => void

  townOutskirtsUnlocked: boolean

  setTownOutskirtsUnlocked: (
    unlocked: boolean
  ) => void

  relationships: Relationship[]

setRelationships: React.Dispatch<
  React.SetStateAction<Relationship[]>
>

recruitedHeroes: Unit[]

registerHeroes: (heroes: Unit[]) => void

}

const GameContext =
  createContext<
    GameContextType | undefined
  >(undefined)

export function GameProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [party, setParty] =
    useState<Unit[]>([])

  const [relationships, setRelationships] =
  useState<Relationship[]>([])

  const [recruitedHeroes, setRecruitedHeroes] =
  useState<Unit[]>([])

  const [gold, setGoldState] =
    useState(100)

  const goldRef = useRef(gold)

  const [inventory, setInventoryState] =
    useState<Inventory>({})

  const inventoryRef = useRef(inventory)

  function setGold(nextGold: number) {
    goldRef.current = nextGold
    setGoldState(nextGold)
  }

  const [
    completedScriptedEncounters,
    setCompletedScriptedEncounters
  ] = useState<CompletedScriptedEncounters>({})

  const [
    sleepingQuartersUnlocked,
    setSleepingQuartersUnlocked
  ] = useState(false)

  const [
    itemShopUnlocked,
    setItemShopUnlocked
  ] = useState(false)

  const [
    mayorUnlocked,
    setMayorUnlocked
  ] = useState(false)

  const [mayorRewardClaimed, setMayorRewardClaimed] = useState(false)

  const [
    weaponShopUnlocked,
    setWeaponShopUnlocked
  ] = useState(false)

  const [
    questBoardUnlocked,
    setQuestBoardUnlocked
  ] = useState(false)

  const [
    windmillRowUnlocked,
    setWindmillRowUnlocked
  ] = useState(false)

  const [
    townOutskirtsUnlocked,
    setTownOutskirtsUnlocked
  ] = useState(false)

  const [examinedObjects, setExaminedObjects] =
    useState<string[]>([])

  function examineObject(objectId: string) {
    setExaminedObjects(prev =>
      prev.includes(objectId)
        ? prev
        : [...prev, objectId]
    )
  }

  function registerHeroes(heroes: Unit[]) {
  setRecruitedHeroes(prev => {
    const byId = new Map(
      prev.map(hero => [hero.id, hero])
    )

    heroes.forEach(hero => {
      byId.set(hero.id, hero)
    })

    return [...byId.values()]
  })

  setRelationships(prev =>
    registerRelationshipMembers(prev, heroes)
  )
}

  function updateHero(
    heroId: string,
    updater: (hero: Unit) => Unit
  ) {

    const hero =
      party.find(h => h.id === heroId) ??
      recruitedHeroes.find(
        h => h.id === heroId
      )

    if (!hero) return

    const updated = updater(
      structuredClone(hero)
    )

    if (!updated) return

    setParty(prev =>
      prev.map(h =>
        h.id === heroId ? updated : h
      )
    )

    setRecruitedHeroes(prev =>
      prev.map(h =>
        h.id === heroId ? updated : h
      )
    )

  }

  function commitBattleResults(
    battleUnits: Unit[]
  ) {

    setParty(prev =>
      commitBattleProgress(prev, battleUnits)
    )

    setRecruitedHeroes(prev =>
      commitBattleProgress(prev, battleUnits)
    )

  }

  function applyBattleResult(
    result: BattleResult
  ) {
    if (result.outcome !== "victory") {
      commitBattleResults(result.finalUnits)
      return
    }

    commitBattleResults(result.finalUnits)

    if (result.reward) {
      setGold(
        goldRef.current + result.reward.gold
      )

      for (const drop of result.reward.items) {
        addItem(drop.itemId, drop.quantity)
      }
    }

    if (
      result.isScripted
    ) {
      completeScriptedEncounter(
        result.locationId,
        result.encounterId
      )
    }
  }

  function completeScriptedEncounter(
    locationId: string,
    encounterId: string
  ) {
    setCompletedScriptedEncounters(previous =>
      addCompletedScriptedEncounter(
        previous,
        locationId,
        encounterId
      )
    )
  }

  function addItem(
    itemId: InventoryId,
    quantity = 1
  ) {

    const next = {
      ...inventoryRef.current,
      [itemId]:
        (inventoryRef.current[itemId] || 0) +
        quantity
    }

    inventoryRef.current = next
    setInventoryState(next)

  }

  function removeItem(
    itemId: InventoryId,
    quantity = 1
  ) {

    const next = {
      ...inventoryRef.current
    }

    const remaining =
      (next[itemId] || 0) - quantity

    if (remaining <= 0) {
      delete next[itemId]
    } else {
      next[itemId] = remaining
    }

    inventoryRef.current = next
    setInventoryState(next)

  }

  function purchase(
    itemId: InventoryId,
    price: number,
    options: { unique?: boolean } = {}
  ): PurchaseOutcome {

    const owned =
      inventoryRef.current[itemId] ?? 0

    const evaluation = evaluatePurchase({
      gold: goldRef.current,
      price,
      owned,
      unique: options.unique ?? false
    })

    if (!evaluation.allowed) {
      return {
        ok: false,
        reason: evaluation.reason
      }
    }

    goldRef.current -= price

    const nextInventory = {
      ...inventoryRef.current,
      [itemId]: owned + 1
    }

    inventoryRef.current = nextInventory
    setGoldState(goldRef.current)
    setInventoryState(nextInventory)

    return { ok: true }
  }

  function healParty() {

    setParty(prev =>
      prev.map(unit => ({
        ...unit,
        hp: unit.maxHp,
        statuses: [],
      }))
    )

  }

  return (

    <GameContext.Provider
      value={{

        party,
        setParty,
        updateHero,
        commitBattleResults,
        applyBattleResult,
        completedScriptedEncounters,
        completeScriptedEncounter,

        gold,
        setGold,

        inventory,
        addItem,
        removeItem,
        purchase,

        examinedObjects,
        examineObject,

        healParty,

        sleepingQuartersUnlocked,
        setSleepingQuartersUnlocked,

        itemShopUnlocked,
        setItemShopUnlocked,

        mayorUnlocked,
        setMayorUnlocked,

        weaponShopUnlocked,
        setWeaponShopUnlocked,

        questBoardUnlocked,
        setQuestBoardUnlocked,

        windmillRowUnlocked,
        setWindmillRowUnlocked,

        townOutskirtsUnlocked,
        setTownOutskirtsUnlocked,

        mayorRewardClaimed,
        setMayorRewardClaimed,

        relationships,
        setRelationships,

        recruitedHeroes,
        registerHeroes,

      }}
    >

      {children}

    </GameContext.Provider>

  )

}

export function useGame() {

  const context =
    useContext(GameContext)

  if (!context) {

    throw new Error(
      "useGame must be used inside GameProvider"
    )

  }

  return context

}