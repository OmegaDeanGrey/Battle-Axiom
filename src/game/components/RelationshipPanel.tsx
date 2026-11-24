import { useGame } from "../context/GameContext"
import type { Unit } from "../../battle/models/unit"
import {
  getRelationshipForPair,
  createRelationship,
  heroToRelationshipMember,
  getRelationshipPartner
} from "../../battle/relationships/relationshipPairs"
import {
  getRelationshipTier,
  getRelationshipTierProgress,
  RELATIONSHIP_MAX_POINTS,
  RELATIONSHIP_TIERS
} from "../../battle/relationships/relationshipConfig"
import {
  getUnlockedRelationshipEffects,
  getLockedRelationshipEffects
} from "../../battle/relationships/relationshipAbilities"
import {
  getBondTechniqueDisplay
} from "../../battle/relationships/bondTechniques"
import "./RelationshipPanel.css"

type Props = {
  hero: Unit
  onClose?: () => void
  embedded?: boolean
}

export default function RelationshipPanel({
  hero,
  onClose,
  embedded = false
}: Props) {

 const {
  relationships,
  party
} = useGame()

const recruitedHeroes = party

  const partners =
    recruitedHeroes.filter(
      recruited =>
        recruited.id !== hero.id
    )

  const bondTierPoints =
    RELATIONSHIP_TIERS.find(
      tier => tier.id === "bonded"
    )?.minPoints ?? 0

  const panel = (

    <div
      className={
        "relationship-panel" +
        (embedded
          ? " relationship-panel-embedded"
          : "")
      }
      onClick={
        embedded
          ? undefined
          : event =>
              event.stopPropagation()
      }
    >

      {!embedded && (
        <button
          className="party-screen-close"
          onClick={onClose}
        >
          X
        </button>
      )}

        <h1>
          Bonds of {hero.name}
        </h1>

        <p className="relationship-panel-intro">
          Relationships grow through shared battles and
          story events. Each tier unlocks a cooperative
          effect that remains with the pair.
        </p>

        {partners.length === 0 ? (
          <p className="party-screen-empty">
            Relationships develop as heroes adventure
            together. Recruit another hero to begin a
            bond.
          </p>
        ) : (
          <div className="relationship-panel-list">
            {partners.map(partner => {

              const relationship =
                getRelationshipForPair(
                  relationships,
                  hero.id,
                  partner.id
                ) ??
                createRelationship(
                  heroToRelationshipMember(hero),
                  heroToRelationshipMember(partner)
                )

              const progress =
                getRelationshipTierProgress(
                  relationship.points
                )

              const tier =
                getRelationshipTier(
                  relationship.points
                )

              const member =
                getRelationshipPartner(
                  relationship,
                  hero.id
                ) ??
                heroToRelationshipMember(partner)

              const unlocked =
                getUnlockedRelationshipEffects(
                  relationship
                )

              const locked =
                getLockedRelationshipEffects(
                  relationship
                )

              const technique =
                getBondTechniqueDisplay(
                  relationship
                )

              return (

                <div
                  key={partner.id}
                  className="relationship-card"
                >

                  <div className="relationship-card-head">
                    <div
                      className="relationship-card-portrait"
                      style={{
                        backgroundImage:
                          member.portrait
                            ? `url(${member.portrait})`
                            : undefined
                      }}
                    />

                    <div className="relationship-card-title">
                      <div className="relationship-partner-name">
                        {member.name}
                      </div>
                      <div className="relationship-partner-class">
                        {member.heroClass}
                      </div>
                    </div>

                    <div className="relationship-tier">
                      {tier.name}
                    </div>
                  </div>

                  <div className="relationship-points">
                    {relationship.points} /{" "}
                    {RELATIONSHIP_MAX_POINTS} points
                  </div>

                  <div className="relationship-progress-bar">
                    <div
                      style={{
                        width: `${progress.progress * 100}%`
                      }}
                    />
                  </div>

                  <div className="relationship-progress-label">
                    {progress.nextTier
                      ? `${progress.pointsToNext} points to ${progress.nextTier.name}`
                      : "Maximum bond reached"}
                  </div>

                  <p className="relationship-description">
                    {tier.description}
                  </p>

                  <div className="relationship-effects">
                    {unlocked.map(effect => (
                      <div
                        key={effect.id}
                        className="relationship-effect is-unlocked"
                      >
                        <strong>
                          {effect.name}
                        </strong>
                        <span>
                          {effect.description}
                        </span>
                      </div>
                    ))}

                    {locked.map(effect => (
                      <div
                        key={effect.id}
                        className="relationship-effect is-locked"
                      >
                        <strong>
                          {effect.name}
                        </strong>
                        <span>
                          Unlocks at{" "}
                          {effect.requiredPoints} points
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="relationship-technique">
                    <strong>
                      Bond Technique:{" "}
                      {technique.name}
                    </strong>
                    <span>
                      {relationship.points >=
                      bondTierPoints
                        ? technique.description
                        : `Unlocks at ${bondTierPoints} points. Class combinations determine the technique.`}
                    </span>
                  </div>

                </div>
              )
            })}
          </div>
        )}

    </div>
  )

  if (embedded) {
    return panel
  }

  return (

    <div
      className="modal-overlay"
      onClick={onClose}
    >
      {panel}
    </div>
  )
}
