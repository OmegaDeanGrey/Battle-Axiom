import type { Unit } from "../models/unit"
import type { useBattlePresentation } from "./useBattlePresentation"

import BattleCharacter from "./BattleCharacter"

type Presentation = ReturnType<
  typeof useBattlePresentation
>

type Props = {
  units: Unit[]
  background: string
  presentation: Presentation
  targetIds: string[]
  onTarget: (unitId: string) => void
}

export default function BattleStage({
  units,
  background,
  presentation,
  targetIds,
  onTarget
}: Props) {
  const enemies = units.filter(
    unit => unit.team === "enemy"
  )

  const heroes = units.filter(
    unit => unit.team === "player"
  )

  function renderUnit(
    unit: Unit,
    side: "player" | "enemy",
    index: number,
    count: number
  ) {
    const isDefeated =
      presentation.defeatedIds.includes(
        unit.id
      ) ||
      (presentation.displayedHp[unit.id] ??
        unit.hp) <= 0

    const isVictorious =
      side === "player" &&
      !isDefeated &&
      presentation.victoryState !== "idle"

    const isActing =
      presentation.actingUnitId === unit.id

    return (
      <BattleCharacter
        key={unit.id}
        unit={unit}
        side={side}
        index={index}
        count={count}
        displayedHp={
          presentation.displayedHp[unit.id] ??
          unit.hp
        }
        isActing={isActing}
        actionKind={presentation.actionKind}
        isLunging={
          isActing &&
          presentation.lungeTargetId !== null
        }
        isReacting={
          presentation.reactingUnitId ===
          unit.id
        }
        reactionKey={presentation.reactionKey}
        isDefeated={isDefeated}
        isVictorious={isVictorious}
        impact={presentation.impact}
        floaters={presentation.floaters}
        isTargetable={targetIds.includes(
          unit.id
        )}
        onTarget={
          targetIds.includes(unit.id)
            ? () => onTarget(unit.id)
            : undefined
        }
      />
    )
  }

  return (
    <div
      className="ba-stage"
      style={{
        backgroundImage: `url("${background}")`
      }}
    >
      <div className="ba-stage__haze" />

      <div className="ba-stage__ground" />

      {enemies.map((unit, index) =>
        renderUnit(
          unit,
          "enemy",
          index,
          enemies.length
        )
      )}

      {heroes.map((unit, index) =>
        renderUnit(
          unit,
          "player",
          index,
          heroes.length
        )
      )}

      <div className="ba-stage__side-label ba-stage__side-label--enemy">
        Enemies
      </div>

      <div className="ba-stage__side-label ba-stage__side-label--player">
        Your Party
      </div>
    </div>
  )
}
