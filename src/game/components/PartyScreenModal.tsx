import { useState } from "react"
import { useGame } from "../context/GameContext"
import {
  ItemRegistry,
  isItemId
} from "../data/ItemRegistry"
import {
  RelicRegistry
} from "../data/RelicRegistry"
import PartySynergyPanel from "./PartySynergyPanel"
import SkillTreeScreen from "./SkillTreeScreen"
import RelationshipPanel from "./RelationshipPanel"
import {
  getSynergyBonuses
} from "../../battle/synergy/getSynergyBonuses"
import "./PartyScreenModal.css"

type Props = {
  onClose: () => void
}

type View =
  | "overview"
  | "synergy"
  | "relationships"

export default function PartyScreenModal({
  onClose
}: Props) {

  const {
    party,
    recruitedHeroes,
    gold,
    inventory
  } = useGame()

  const [
    selectedHeroId,
    setSelectedHeroId
  ] = useState<string | null>(null)

  const [
    selectedRelationshipHeroId,
    setSelectedRelationshipHeroId
  ] = useState<string | null>(null)

  const [view, setView] =
    useState<View>("overview")

  const inventoryEntries =
    Object.entries(inventory) as [
      string,
      number
    ][]

  const selectedHero =
    party.find(
      hero =>
        hero.id === selectedHeroId
    ) ?? null

  const selectedRelationshipHero =
    party.find(
      hero =>
        hero.id ===
        selectedRelationshipHeroId
    ) ?? null

  const synergyBonuses =
    getSynergyBonuses(party)

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
      >
        <div
          className="party-screen-modal"
        onClick={event =>
          event.stopPropagation()
        }
      >
        <button
          className="party-screen-close"
          onClick={onClose}
        >
          X
        </button>

        <h1>Party Organization</h1>

        <div className="party-screen-gold">
          Gold: {gold}g
        </div>

        <div className="party-screen-tabs">
          <button
            className={
              "party-modal-buttons" +
              (view === "overview"
                ? " is-active"
                : "")
            }
            onClick={() =>
              setView("overview")
            }
          >
            Party
          </button>
          <button
            className={
              "party-modal-buttons" +
              (view === "synergy"
                ? " is-active"
                : "")
            }
            onClick={() =>
              setView("synergy")
            }
          >
            Synergy
          </button>
          <button
            className={
              "party-modal-buttons" +
              (view === "relationships"
                ? " is-active"
                : "")
            }
            onClick={() =>
              setView("relationships")
            }
          >
            Relationships
          </button>
        </div>

        {view === "overview" && (
          <>
            <section className="party-screen-section">
              <h2>Heroes</h2>
              {party.length === 0 ? (
                <p className="party-screen-empty">
                  No heroes chosen yet.
                </p>
              ) : (
                <div className="party-screen-heroes">
                  {party.map(hero => (
                    <div
                      key={hero.id}
                      className="party-screen-hero"
                    >
                      <button
                        type="button"
                        className="party-screen-hero-main"
                        onClick={() =>
                          setSelectedHeroId(
                            hero.id
                          )
                        }
                      >
                        <div
                          className="party-screen-portrait"
                          style={{
                            backgroundImage:
                              `url(${hero.portrait})`
                          }}
                        />
                        <div className="party-screen-hero-info">
                          <div className="party-screen-hero-name">
                            {hero.name}
                          </div>
                          <div className="party-screen-hero-class">
                            {hero.heroClass} · Lv{" "}
                            {hero.level}
                          </div>
                          <div className="party-screen-hero-stats">
                            HP {hero.hp}/{hero.maxHp} ·
                            ATK {hero.attack} · DEF{" "}
                            {hero.defense}
                          </div>
                          <div className="party-screen-hero-cta">
                            Skills › ·{" "}
                            {hero.skillPoints} SP
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="party-screen-hero-bonds"
                        onClick={() =>
                          setSelectedRelationshipHeroId(
                            hero.id
                          )
                        }
                      >
                        Bonds ›
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="party-screen-section">
              <h2>Items</h2>
              {inventoryEntries.length === 0 ? (
                <p className="party-screen-empty">
                  No items.
                </p>
              ) : (
                <div className="party-screen-items">
                  {inventoryEntries.map(
                    ([itemId, quantity]) => {
                      const item = isItemId(itemId)
                        ? ItemRegistry[itemId]
                        : RelicRegistry[
                            itemId as keyof typeof RelicRegistry
                          ]

                      if (!item) return null

                      const isRelic =
                        !isItemId(itemId)

                      return (
                        <div
                          key={itemId}
                          className="party-screen-item"
                        >
                          {"image" in item && item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="party-screen-item-image"
                            />
                          )}
                          <div className="party-screen-item-info">
                            <div className="party-screen-item-name">
                              {item.name}
                              {isRelic && " (Relic)"}
                            </div>
                            <div className="party-screen-item-desc">
                              {item.description}
                            </div>
                          </div>
                          <div className="party-screen-item-qty">
                            x{quantity}
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {view === "synergy" && (
          <section className="party-screen-section">
            <h2>Synergy Bonuses</h2>
            {Object.keys(synergyBonuses).length ===
            0 ? (
              <p className="party-screen-empty">
                No synergy bonuses are active.
              </p>
            ) : (
              <div className="party-bonus-list">
                {Object.entries(
                  synergyBonuses
                ).map(([type, value]) => (
                  <div
                    key={type}
                    className="party-bonus-chip"
                  >
                    {type}: +{value}
                  </div>
                ))}
              </div>
            )}
            <PartySynergyPanel party={party} />
          </section>
        )}

        {view === "relationships" && (
          <section className="party-screen-section">
            <h2>Relationships</h2>
            {recruitedHeroes.length < 2 ? (
              <p className="party-screen-empty">
                Relationships develop as heroes adventure
                together. Recruit at least two heroes to
                begin building bonds.
              </p>
            ) : (
              <div className="party-relationships-tab">
                {recruitedHeroes.map(hero => (
                  <RelationshipPanel
                    key={hero.id}
                    hero={hero}
                    embedded
                  />
                ))}
              </div>
            )}
          </section>
        )}

        </div>
      </div>

      {selectedHero && (
        <SkillTreeScreen
          hero={selectedHero}
          onClose={() =>
            setSelectedHeroId(null)
          }
        />
      )}

      {selectedRelationshipHero && (
        <RelationshipPanel
          hero={selectedRelationshipHero}
          onClose={() =>
            setSelectedRelationshipHeroId(
              null
            )
          }
        />
      )}
    </>
  )
}
