import { useGame } from "../context/GameContext"
import type { Unit } from "../../battle/models/unit"
import type { SkillNode } from "../../battle/models/skillNode"
import { AbilityRegistry } from "../../battle/abilities/abilityRegistry"
import {
  getSkillAvailability,
  getSkillValue
} from "../../battle/skills/skillTreeHelpers"
import { unlockSkill } from "../../battle/progression/unlockSkill"
import { getXpToNextLevel } from "../../battle/progression/grantXp"
import "./SkillTreeScreen.css"

type Props = {
  hero: Unit
  onClose: () => void
}

function describeEffect(node: SkillNode) {

  if (node.effect.type === "stat") {
    const perRank =
      node.effect.perRank ?? 0

    return (
      `${node.effect.stat.toUpperCase()} +` +
      `${getSkillValue(node, 1)}` +
      (perRank > 0
        ? `  (+${perRank} each rank)`
        : "")
    )
  }

  const abilityIds =
    node.effect.rankedAbilityIds ||
    [node.effect.abilityId]

  return (
    "Ability: " +
    abilityIds
      .map(id =>
        AbilityRegistry[id]?.name ?? id
      )
      .join(" → ")
  )
}

export default function SkillTreeScreen({
  hero,
  onClose
}: Props) {

  const { updateHero } = useGame()

  const xpNeeded =
    getXpToNextLevel(hero.level)

  const xpPercent =
    Math.min(
      100,
      (hero.xp / xpNeeded) * 100
    )

  const branches:
    Record<string, SkillNode[]> = {}

  for (const node of hero.skillTree) {
    if (!branches[node.branch]) {
      branches[node.branch] = []
    }
    branches[node.branch].push(node)
  }

  function handleUnlock(nodeId: string) {

    updateHero(hero.id, heroCopy => {

      unlockSkill(
        heroCopy,
        nodeId
      )

      return heroCopy
    })

  }

  return (
    <div
      className="skill-tree-overlay"
      onClick={onClose}
    >
      <div
        className="skill-tree-modal"
        onClick={event =>
          event.stopPropagation()
        }
      >
        <button
          className="skill-tree-close"
          onClick={onClose}
          aria-label="Close skill tree"
        >
          X
        </button>

        <h1>{hero.name}</h1>

        <div className="skill-tree-subtitle">
          {hero.heroClass} · Level {hero.level}
        </div>

        <div className="skill-tree-progress">
          <div className="skill-tree-xp-bar">
            <div
              className="skill-tree-xp-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="skill-tree-xp-label">
            XP {hero.xp} / {xpNeeded}
          </div>
        </div>

        <div className="skill-tree-points">
          Skill Points: {hero.skillPoints}
        </div>

        <p className="skill-tree-hint">
          Earn skill points by gaining levels in battle.
          Skills gain power each rank.
        </p>

        {hero.skillTree.length === 0 ? (
          <p className="skill-tree-empty">
            No skill tree is defined for this class yet.
          </p>
        ) : (
          Object.entries(branches).map(
            ([branch, nodes]) => (
              <section
                key={branch}
                className="skill-tree-branch"
              >
                <h2>{branch}</h2>

                <div className="skill-tree-nodes">
                  {nodes.map(node => {

                    const availability =
                      getSkillAvailability(
                        hero,
                        node
                      )

                    return (
                      <div
                        key={node.id}
                        className={
                          "skill-tree-node" +
                          (node.rank > 0
                            ? " is-learned"
                            : "")
                        }
                      >
                        <div className="skill-tree-node-head">
                          <strong>
                            {node.name}
                          </strong>
                          <span className="skill-tree-rank">
                            {node.rank} / {node.maxRank}
                          </span>
                        </div>

                        <div className="skill-tree-tier">
                          Tier {node.tier} · Level{" "}
                          {node.minLevel}
                        </div>

                        <p className="skill-tree-desc">
                          {node.description}
                        </p>

                        <div className="skill-tree-effect">
                          {describeEffect(node)}
                        </div>

                        {node.requires &&
                          node.requires.length > 0 && (
                            <div className="skill-tree-requires">
                              Requires:{" "}
                              {node.requires.join(", ")}
                            </div>
                          )}

                        <button
                          className="skill-tree-learn"
                          disabled={
                            !availability.available
                          }
                          onClick={() =>
                            handleUnlock(node.id)
                          }
                        >
                          {availability.available
                            ? `Learn · ${node.cost} SP`
                            : availability.reason}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          )
        )}
      </div>
    </div>
  )
}
