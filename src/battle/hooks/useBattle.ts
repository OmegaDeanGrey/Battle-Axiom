import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import {
  createBattle,
  tickBattle,
  type BattleState
} from "../engine/battleEngine"

import type { Unit } from "../models/unit"
import type {
  Relationship
} from "../models/relationship"
import type { Action } from "../models/action"

import { performAction } from "../engine/performAction"
import {
  getValidItemTargetIds
} from "../engine/itemTargets"
import {
  isBattleConsumable
} from "../../game/data/ItemRegistry"

type InventoryMap = Readonly<
  Partial<Record<string, number>>
>

type ConsumeItem = (
  itemId: string,
  quantity: number
) => void

export function useBattle(
  initialUnits: Unit[],
  initialRelationships?: Relationship[],
  inputLocked = false,
  inventory: InventoryMap = {},
  consumeItem?: ConsumeItem
) {
  const [battle, setBattle] =
    useState<BattleState>(
      () =>
        createBattle(
          initialUnits,
          initialRelationships
        )
    )

  const presentationLocked =
    useRef(false)

  const actionLocked =
    useRef(false)

  const battleRef = useRef(battle)

  const inventoryRef =
    useRef(inventory)

  const consumeItemRef =
    useRef(consumeItem)

  useEffect(() => {
    battleRef.current = battle
    inventoryRef.current = inventory
    consumeItemRef.current = consumeItem
  }, [battle, consumeItem, inventory])

  const setPresentationLocked =
    useCallback((locked: boolean) => {
      presentationLocked.current = locked
    }, [])

  const submitAction =
    useCallback(
      (action: Action) => {
        if (
          inputLocked ||
          presentationLocked.current ||
          actionLocked.current
        ) {
          return false
        }

        const current =
          battleRef.current

        if (
          !current.currentActorId ||
          current.winner
        ) {
          return false
        }

        const actor =
          current.units.find(
            unit =>
              unit.id ===
              current.currentActorId
          )

        if (!actor) return false

        if (
          action.type === "ability"
        ) {
          const target =
            current.units.find(
              unit =>
                unit.id ===
                action.targetId
            )

          if (
            !target ||
            !actor.abilities.some(
              ability =>
                ability.id ===
                action.abilityId
            )
          ) {
            return false
          }
        }

        if (action.type === "item") {
          const itemId = action.itemId

          if (
            !isBattleConsumable(itemId) ||
            (inventoryRef.current[itemId] ??
              0) <= 0 ||
            !getValidItemTargetIds(
              current.units,
              actor,
              itemId
            ).includes(action.targetId)
          ) {
            return false
          }
        }

        actionLocked.current = true

        if (action.type === "item") {
          consumeItemRef.current?.(
            action.itemId,
            1
          )
        }

        setBattle(prev => {
          const next = structuredClone(
            prev
          )

          performAction(next, action)

          return next
        })

        return true
      },
      [inputLocked]
    )

  const act = useCallback(
    (
      abilityId: string,
      targetId: string
    ) =>
      submitAction({
        type: "ability",
        abilityId,
        targetId
      }),
    [submitAction]
  )

  const useItemAction = useCallback(
    (itemId: string, targetId: string) =>
      submitAction({
        type: "item",
        itemId,
        targetId
      }),
    [submitAction]
  )

  const tick = useCallback(() => {
    if (
      inputLocked ||
      presentationLocked.current ||
      actionLocked.current
    ) {
      return
    }

    setBattle(prev => {
      const next = structuredClone(
        prev
      )

      tickBattle(next)

      return next
    })
  }, [inputLocked])

  useEffect(() => {
    if (
      !battle.currentActorId &&
      battle.turnResolved
    ) {
      actionLocked.current = false
    }
  }, [
    battle.currentActorId,
    battle.turnResolved
  ])

  useEffect(() => {
    if (
      inputLocked ||
      battle.turnPhase !== "enemy" ||
      !battle.currentActorId
    ) {
      return
    }

    const actor = battle.units.find(
      unit =>
        unit.id === battle.currentActorId
    )

    if (!actor) return

    const target = battle.units.find(
      unit =>
        unit.team === "player" &&
        unit.hp > 0
    )

    if (!target) return

    act(actor.abilities[0].id, target.id)

  }, [
    act,
    inputLocked,
    battle.currentActorId,
    battle.turnPhase,
    battle.units
  ])

  return {
    battle,
    tick,
    act,
    useItem: useItemAction,
    setPresentationLocked
  }
}
