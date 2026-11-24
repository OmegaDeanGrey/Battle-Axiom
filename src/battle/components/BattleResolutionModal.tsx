import type { BattleResult } from "../../game/context/GameContext"
import { ItemRegistry } from "../../game/data/ItemRegistry"

import "./BattleResolutionModal.css"

type Props = {
  result: BattleResult
  onContinue: () => void
}

function xpBar(
  currentXp: number,
  xpToNext: number
): number {
  if (xpToNext <= 0) return 100
  return Math.max(
    0,
    Math.min(
      100,
      Math.round((currentXp / xpToNext) * 100)
    )
  )
}

export default function BattleResolutionModal({
  result,
  onContinue
}: Props) {
  if (result.outcome !== "victory") {
    return null
  }

  const reward = result.reward

  return (
    <div className="battle-resolution-overlay">
      <div className="battle-resolution-modal">
        <div className="battle-resolution-eyebrow">
          Battle Axiom
        </div>

        <h2 className="battle-resolution-title">
          Victory!
        </h2>

        <div className="battle-resolution-subtitle">
          {result.encounterName}
        </div>

        {result.conclusion && (
          <p className="battle-resolution-conclusion">
            {result.conclusion}
          </p>
        )}

        <section className="battle-resolution-section">
          <h3>Heroes</h3>

          <div className="battle-resolution-heroes">
            {result.heroProgress.map(hero => (
              <div
                key={hero.id}
                className="battle-resolution-hero"
              >
                <div
                  className="battle-resolution-hero__portrait"
                  style={{
                    backgroundImage:
                      `url(${hero.portrait})`
                  }}
                />

                <div className="battle-resolution-hero__body">
                  <div className="battle-resolution-hero__header">
                    <div>
                      <div className="battle-resolution-hero__name">
                        {hero.name}
                      </div>
                      <div className="battle-resolution-hero__class">
                        {hero.heroClass} · Lv {hero.level}
                      </div>
                    </div>

                    <div className="battle-resolution-hero__state">
                      {hero.survived
                        ? "Survived"
                        : "Defeated"}
                    </div>
                  </div>

                  <div className="battle-resolution-hero__hp">
                    HP {hero.hp}/{hero.maxHp}
                  </div>

                  <div className="battle-resolution-hpbar">
                    <div
                      className="battle-resolution-hpbar__fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            Math.round(
                              (hero.hp / Math.max(1, hero.maxHp)) * 100
                            )
                          )
                        )}%`
                      }}
                    />
                  </div>

                  <div className="battle-resolution-hero__xp">
                    XP gained: {hero.xpGained}
                  </div>

                  <div className="battle-resolution-xpbar">
                    <div
                      className="battle-resolution-xpbar__fill"
                      style={{
                        width: `${xpBar(hero.xp, hero.xpToNext)}%`
                      }}
                    />
                  </div>

                  <div className="battle-resolution-hero__meta">
                    XP {hero.xp}/{hero.xpToNext}
                  </div>

                  {hero.levelsGained > 0 && (
                    <div className="battle-resolution-hero__notice">
                      Level Up! (+{hero.skillPointsGained} SP)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="battle-resolution-section">
          <h3>Gold</h3>

          <div className="battle-resolution-gold">
            <div>
              Gained: {reward?.gold ?? 0}g
            </div>
          </div>
        </section>

        <section className="battle-resolution-section">
          <h3>Items</h3>

          {reward && reward.items.length > 0 ? (
            <div className="battle-resolution-items">
              {reward.items.map(drop => {
                const item =
                  ItemRegistry[drop.itemId]

                return (
                  <div
                    key={drop.itemId}
                    className="battle-resolution-item"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="battle-resolution-item__image"
                      />
                    )}

                    <div className="battle-resolution-item__body">
                      <div className="battle-resolution-item__name">
                        {item.name}
                      </div>
                      {item.rarity && (
                        <div className="battle-resolution-item__rarity">
                          {item.rarity}
                        </div>
                      )}
                    </div>

                    <div className="battle-resolution-item__qty">
                      x{drop.quantity}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="battle-resolution-empty">
              No items were found.
            </p>
          )}
        </section>

        <div className="battle-resolution-actions">
          <button
            className="ba-button"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
