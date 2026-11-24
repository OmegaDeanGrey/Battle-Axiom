import type { Unit } from "../models/unit"
import type {
  FloatingText,
  PresentationImpact
} from "./useBattlePresentation"
import type { PresentationActionKind } from "./battleVisualAssets"

import {
  getCharacterVisual
} from "./battleVisualAssets"

type Props = {
  unit: Unit
  side: "player" | "enemy"
  index: number
  count: number
  displayedHp: number
  isActing: boolean
  actionKind: PresentationActionKind | null
  isLunging: boolean
  isReacting: boolean
  reactionKey: number
  isDefeated: boolean
  isVictorious: boolean
  impact: PresentationImpact | null
  floaters: FloatingText[]
  isTargetable: boolean
  onTarget?: () => void
}

export default function BattleCharacter({
  unit,
  side,
  index,
  count,
  displayedHp,
  isActing,
  actionKind,
  isLunging,
  isReacting,
  reactionKey,
  isDefeated,
  isVictorious,
  impact,
  floaters,
  isTargetable,
  onTarget
}: Props) {
  const pose = isDefeated
    ? "defeated"
    : isVictorious
      ? "victory"
      : isReacting
        ? "damage"
        : isActing
          ? actionKind === "support" ||
            actionKind === "magic"
              ? "casting"
              : "attack"
          : "idle"

  const visual = getCharacterVisual(
    unit,
    pose
  )

  const spanStart =
    side === "enemy" ? 10 : 58

  const spanWidth =
    side === "enemy"
      ? count > 3
        ? 38
        : 32
      : 34

  const left =
    spanStart +
    (spanWidth * (index + 0.5)) / count

  const bottom =
    13 +
    (index % 2) * 5 +
    visual.offsetY

  const positionStyle = {
    left: `${left}%`,
    bottom: `${bottom}%`,
    "--ba-scale": visual.scale,
    "--ba-accent": visual.accent,
    "--ba-offset-x": `${visual.offsetX}px`
  } as React.CSSProperties

  const bodyClass = [
    "ba-char__body",
    isDefeated
      ? "is-defeated"
      : isVictorious
        ? "is-victorious"
        : isLunging
          ? side === "enemy"
            ? "is-lunging-right"
            : "is-lunging-left"
          : isReacting
            ? reactionKey % 2 === 0
              ? "is-reacting-a"
              : "is-reacting-b"
            : isActing
              ? "is-acting"
              : "is-idle"
  ].join(" ")

  const hpPercent =
    unit.maxHp > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (displayedHp / unit.maxHp) * 100
          )
        )
      : 0

  return (
    <div
      className={[
        "ba-char",
        `ba-char--${side}`,
        isTargetable
          ? "is-targetable"
          : "",
        count > 3
          ? "ba-char--crowded"
          : "",
        isDefeated ? "is-defeated" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      style={positionStyle}
      onClick={onTarget}
      onKeyDown={
        onTarget
          ? event => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault()
                onTarget()
              }
            }
          : undefined
      }
      role={onTarget ? "button" : undefined}
      tabIndex={onTarget ? 0 : undefined}
      aria-label={
        onTarget
          ? `Target ${unit.name}`
          : unit.name
      }
    >
      <div className="ba-char__shadow" />

      <div className={bodyClass}>
        <div
          className={[
            "ba-char__glow",
            side === "enemy"
              ? "ba-char__glow--enemy"
              : "ba-char__glow--player"
          ].join(" ")}
        />
        <img
          className={[
            "ba-char__art",
            visual.facing === "left"
              ? "is-facing-left"
              : "is-facing-right"
          ].join(" ")}
          src={visual.src}
          alt={unit.name}
          draggable={false}
        />

        {isActing &&
          actionKind !== null &&
          actionKind !== "physical" && (
            <div className="ba-cast-ring" />
          )}

        {impact?.unitId === unit.id && (
          <div
            key={impact.key}
            className={`ba-impact ba-impact--${impact.kind}`}
          />
        )}
      </div>

      {floaters
        .filter(
          floater =>
            floater.unitId === unit.id
        )
        .map(floater => (
          <div
            key={floater.key}
            className={`ba-float ba-float--${floater.tone}`}
          >
            {floater.text}
          </div>
        ))}

      <div className="ba-char__plate">
        <div className="ba-char__name">
          {unit.name}
        </div>

        <div className="ba-char__hp-track">
          <div
            className="ba-char__hp-fill"
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="ba-char__hp-text">
          {displayedHp}/{unit.maxHp}
        </div>

        {unit.statuses.length > 0 && (
          <div className="ba-char__statuses">
            {unit.statuses.map(status => (
              <span
                key={status.id}
                title={status.name}
              >
                {status.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
