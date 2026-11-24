import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import type { BattleState } from "../engine/battleEngine"
import type { CombatEvent } from "../events/combatEvents"
import type { Unit } from "../models/unit"

import {
  classifyAction,
  type PresentationActionKind
} from "./battleVisualAssets"

export type FloatingText = {
  key: number
  unitId: string
  text: string
  tone:
    | "damage"
    | "critical"
    | "heal"
    | "status"
    | "miss"
}

export type PresentationImpact = {
  key: number
  unitId: string
  kind: "hit" | "spell" | "heal" | "status"
}

export type VictoryState =
  | "idle"
  | "playing"
  | "complete"

type Params = {
  battle: BattleState
  setLocked: (locked: boolean) => void
}

const TIMINGS = {
  turn: 200,
  physical: 280,
  cast: 360,
  hit: 440,
  heal: 440,
  status: 360,
  tick: 380,
  miss: 380,
  defeat: 260,
  victory: 1000
}

export function useBattlePresentation({
  battle,
  setLocked
}: Params) {
  const [
    displayedHp,
    setDisplayedHp
  ] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      battle.units.map(unit => [
        unit.id,
        unit.hp
      ])
    )
  )

  const [
    actingUnitId,
    setActingUnitId
  ] = useState<string | null>(null)

  const [
    actionKind,
    setActionKind
  ] = useState<PresentationActionKind | null>(
    null
  )

  const [
    lungeTargetId,
    setLungeTargetId
  ] = useState<string | null>(null)

  const [
    impact,
    setImpact
  ] = useState<PresentationImpact | null>(
    null
  )

  const [
    reactingUnitId,
    setReactingUnitId
  ] = useState<string | null>(null)

  const [
    reactionKey,
    setReactionKey
  ] = useState(0)

  const [floaters, setFloaters] =
    useState<FloatingText[]>([])

  const [defeatedIds, setDefeatedIds] =
    useState<string[]>(() =>
      battle.units
        .filter(unit => unit.hp <= 0)
        .map(unit => unit.id)
    )

  const [victoryState, setVictoryState] =
    useState<VictoryState>("idle")

  const [isPresenting, setIsPresenting] =
    useState(false)

  const consumedRef = useRef(0)
  const queueRef = useRef<CombatEvent[]>([])
  const playingRef = useRef(false)
  const cancelledRef = useRef(false)
  const keyRef = useRef(0)
  const timersRef = useRef<number[]>([])
  const unitsRef = useRef<
    Record<string, Unit>
  >({})
  const winnerRef = useRef<
    "player" | "enemy" | undefined
  >(undefined)

  const actionKindRef = useRef<
    PresentationActionKind | null
  >(null)

  useEffect(() => {
    return () => {
      cancelledRef.current = true
      timersRef.current.forEach(
        window.clearTimeout
      )
    }
  }, [])

  const sleep = useCallback(
    (ms: number) =>
      new Promise<void>(resolve => {
        const id = window.setTimeout(() => {
          timersRef.current =
            timersRef.current.filter(
              timer => timer !== id
            )
          resolve()
        }, ms)

        timersRef.current.push(id)
      }),
    []
  )

  const nextKey = useCallback(
    () => ++keyRef.current,
    []
  )

  const pushFloater = useCallback(
    (
      unitId: string,
      text: string,
      tone: FloatingText["tone"]
    ) => {
      setFloaters(previous => [
        ...previous.slice(-3),
        {
          key: nextKey(),
          unitId,
          text,
          tone
        }
      ])
    },
    [nextKey]
  )

  const changeHp = useCallback(
    (unitId: string, delta: number) => {
      setDisplayedHp(previous => {
        const unit = unitsRef.current[unitId]
        const current =
          previous[unitId] ?? unit?.hp ?? 0
        const max = unit?.maxHp ?? current

        return {
          ...previous,
          [unitId]: Math.max(
            0,
            Math.min(max, current + delta)
          )
        }
      })
    },
    []
  )

  const playEvent = useCallback(
    async (event: CombatEvent) => {
      switch (event.type) {
        case "turn-start": {
          actionKindRef.current = null

          setActingUnitId(event.unitId)
          setActionKind(null)
          setLungeTargetId(null)
          setImpact(null)
          setReactingUnitId(null)

          await sleep(TIMINGS.turn)
          break
        }

        case "ability-used": {
          const kind = classifyAction(
            event.abilityId,
            event.effectKinds
          )

          actionKindRef.current = kind

          setActingUnitId(event.actorId)
          setActionKind(kind)
          setImpact(null)
          setReactingUnitId(null)
          setLungeTargetId(
            kind === "physical"
              ? event.targetId
              : null
          )

          await sleep(
            kind === "physical"
              ? TIMINGS.physical
              : TIMINGS.cast
          )
          break
        }

        case "item-used": {
          const kind =
            event.effectKinds.includes(
              "heal"
            )
              ? "support"
              : "magic"

          actionKindRef.current = kind

          setActingUnitId(event.actorId)
          setActionKind(kind)
          setImpact(null)
          setReactingUnitId(null)
          setLungeTargetId(null)

          await sleep(TIMINGS.cast)
          break
        }

        case "damage": {
          setLungeTargetId(null)
          setImpact({
            key: nextKey(),
            unitId: event.targetId,
            kind:
              actionKindRef.current ===
              "physical"
                ? "hit"
                : "spell"
          })
          setReactingUnitId(event.targetId)
          setReactionKey(nextKey())
          pushFloater(
            event.targetId,
            event.critical
              ? `CRIT ${event.amount}`
              : `${event.amount}`,
            event.critical
              ? "critical"
              : "damage"
          )
          changeHp(event.targetId, -event.amount)

          await sleep(TIMINGS.hit)
          break
        }

        case "heal": {
          setLungeTargetId(null)
          setImpact({
            key: nextKey(),
            unitId: event.targetId,
            kind: "heal"
          })
          setReactingUnitId(null)
          pushFloater(
            event.targetId,
            `+${event.amount}`,
            "heal"
          )
          changeHp(event.targetId, event.amount)

          await sleep(TIMINGS.heal)
          break
        }

        case "status-applied": {
          setLungeTargetId(null)
          setImpact({
            key: nextKey(),
            unitId: event.targetId,
            kind: "status"
          })
          setReactingUnitId(null)
          pushFloater(
            event.targetId,
            event.statusName,
            "status"
          )

          await sleep(TIMINGS.status)
          break
        }

        case "status-removed": {
          setLungeTargetId(null)
          setImpact({
            key: nextKey(),
            unitId: event.targetId,
            kind: "status"
          })
          setReactingUnitId(null)
          pushFloater(
            event.targetId,
            `-${event.statusName}`,
            "status"
          )

          await sleep(TIMINGS.status)
          break
        }

        case "status-tick": {
          setImpact({
            key: nextKey(),
            unitId: event.targetId,
            kind: "spell"
          })
          setReactingUnitId(event.targetId)
          setReactionKey(nextKey())
          pushFloater(
            event.targetId,
            `${event.amount}`,
            "damage"
          )
          changeHp(event.targetId, -event.amount)

          await sleep(TIMINGS.tick)
          break
        }

        case "miss": {
          setLungeTargetId(null)
          setImpact(null)
          pushFloater(
            event.targetId,
            "MISS",
            "miss"
          )

          await sleep(TIMINGS.miss)
          break
        }

        case "defeat": {
          setDefeatedIds(previous =>
            previous.includes(event.unitId)
              ? previous
              : [...previous, event.unitId]
          )

          await sleep(TIMINGS.defeat)
          break
        }

        case "victory": {
          setActingUnitId(null)
          setLungeTargetId(null)
          setVictoryState("playing")

          await sleep(TIMINGS.victory)
          break
        }
      }
    },
    [
      changeHp,
      nextKey,
      pushFloater,
      sleep
    ]
  )

  const drain = useCallback(
    async () => {
      if (playingRef.current) return

      playingRef.current = true
      setIsPresenting(true)
      setLocked(true)

      while (queueRef.current.length > 0) {
        if (cancelledRef.current) break

        const event = queueRef.current.shift()

        if (event) {
          await playEvent(event)
        }
      }

      if (!cancelledRef.current) {
        setActingUnitId(null)
        setLungeTargetId(null)
        setReactingUnitId(null)
        setImpact(null)
        setFloaters([])

        if (winnerRef.current) {
          setVictoryState("complete")
        }

        setIsPresenting(false)
        setLocked(false)
      }

      playingRef.current = false
    },
    [playEvent, setLocked]
  )

  useEffect(() => {
    unitsRef.current =
      Object.fromEntries(
        battle.units.map(unit => [
          unit.id,
          unit
        ])
      )

    winnerRef.current = battle.winner

    const pending =
      battle.combatEvents.slice(
        consumedRef.current
      )

    consumedRef.current =
      battle.combatEvents.length

    if (pending.length === 0) {
      return
    }

    queueRef.current.push(...pending)

    if (!playingRef.current) {
      void Promise.resolve().then(drain)
    }
  }, [battle, drain])

  return {
    displayedHp,
    actingUnitId,
    actionKind,
    lungeTargetId,
    impact,
    reactingUnitId,
    reactionKey,
    floaters,
    defeatedIds,
    victoryState,
    isPresenting
  }
}
