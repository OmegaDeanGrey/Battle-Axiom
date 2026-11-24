import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import { useBattle } from "../hooks/useBattle"

import type { Unit } from "../models/unit"
import type { Relationship } from "../models/relationship"
import type { BattleState } from "../engine/battleEngine"

import AbilityBar from "./AbilityBar"
import BattleLog from "./BattleLog"
import BattleStage from "../visuals/BattleStage"
import { useBattlePresentation } from "../visuals/useBattlePresentation"
import { getBattleBackground } from "../visuals/battleVisualAssets"

import DialogueBox from "../../game/components/DialogueBox"
import { useGame } from "../../game/context/GameContext"
import {
  ItemRegistry,
  isBattleConsumable,
  type ItemId
} from "../../game/data/ItemRegistry"
import {
  getValidItemTargetIds
} from "../engine/itemTargets"
import BattleInventoryModal from "./BattleInventoryModal"

import {
  advanceDialogue,
  createDialogueGateState,
  currentDialogueLine,
  isDialogueActive
} from "../encounters/encounterGenerator"

import type { DialogueLine } from "../encounters/encounterTypes"

import "./BattleView.css"

import { unlockSkill } from "../progression/unlockSkill"
import {
  getSkillAvailability
} from "../skills/skillTreeHelpers"
import {
  getRelationshipTier,
  RELATIONSHIP_MAX_POINTS
} from "../relationships/relationshipConfig"

type Props = {
  units: Unit[]
  relationships?: Relationship[]
  backgroundId?: string
  openingDialogue?: readonly DialogueLine[]
  inputLocked?: boolean
  onBattleEnd?: (
    battle: BattleState
  ) => void
}

export default function BattleView({
  units,
  relationships,
  backgroundId,
  openingDialogue,
  inputLocked = false,
  onBattleEnd
}: Props) {
  const audioRef =
    useRef<HTMLAudioElement>(null)

  const { inventory, removeItem } =
    useGame()

  const [dialogueGate, setDialogueGate] =
    useState(() =>
      createDialogueGateState(
        openingDialogue
      )
    )

  const dialogueActive =
    isDialogueActive(dialogueGate)

  const activeDialogueLine =
    currentDialogueLine(dialogueGate)

  const commandsLocked =
    dialogueActive || inputLocked

  const {
    battle,
    tick,
    act,
    useItem: submitItemAction,
    setPresentationLocked
  } = useBattle(
    units,
    relationships,
    commandsLocked,
    inventory,
    itemId => removeItem(itemId as ItemId)
  )

  const presentation =
    useBattlePresentation({
      battle,
      setLocked: setPresentationLocked
    })

  const isBusy = presentation.isPresenting

  const battleEnded =
    useRef(false)

  const latestBattleRef =
    useRef(battle)

  const latestEndRef =
    useRef(onBattleEnd)

  useEffect(() => {
    latestBattleRef.current = battle
  }, [battle])

  useEffect(() => {
    latestEndRef.current = onBattleEnd
  }, [onBattleEnd])

  useEffect(() => {
    return () => {
      const finished =
        latestBattleRef.current

      if (
        finished.winner &&
        !battleEnded.current
      ) {
        battleEnded.current = true
        latestEndRef.current?.(finished)
      }
    }
  }, [])

  useEffect(() => {
    if (
      !battle.winner ||
      battleEnded.current
    ) {
      return
    }

    if (
      isBusy ||
      presentation.victoryState !==
        "complete"
    ) {
      return
    }

    battleEnded.current = true

    onBattleEnd?.(battle)

  }, [
    battle,
    battle.winner,
    isBusy,
    onBattleEnd,
    presentation.victoryState
  ])

  const [
    selectedAbilityId,
    setSelectedAbilityId
  ] = useState<string | null>(null)

  const [
    selectedItemId,
    setSelectedItemId
  ] = useState<ItemId | null>(null)

  const [
    inventoryOpen,
    setInventoryOpen
  ] = useState(false)

  const [
    expandedHeroId,
    setExpandedHeroId
  ] = useState<string | null>(null)

  const [
    ,
    refreshSkills
  ] = useState(0)

  const currentActor =
    battle.units.find(
      unit =>
        unit.id === battle.currentActorId
    )

  const selectedAbility =
    currentActor?.abilities.find(
      ability =>
        ability.id === selectedAbilityId
    )

  const selectedItem =
    selectedItemId &&
    isBattleConsumable(selectedItemId)
      ? ItemRegistry[selectedItemId]
      : undefined

  const isSupportSelected =
    selectedAbility?.effects.some(
      effect =>
        effect.type === "heal"
    ) ?? false

  const itemTargetIds =
    currentActor && selectedItemId
      ? getValidItemTargetIds(
          battle.units,
          currentActor,
          selectedItemId
        )
      : []

  const targetIds: string[] =
    currentActor &&
    !commandsLocked &&
    !isBusy &&
    !battle.winner
      ? selectedItemId
        ? (inventory[selectedItemId] ?? 0) >
            0
          ? itemTargetIds
          : []
        : selectedAbility
          ? battle.units
              .filter(unit => {
                if (
                  unit.hp <= 0
                ) {
                  return false
                }

                return isSupportSelected
                  ? unit.team ===
                      currentActor.team
                  : unit.team !==
                      currentActor.team
              })
              .map(unit => unit.id)
          : []
      : []

  function handleSelectAbility(
    abilityId: string | null
  ) {
    setSelectedItemId(null)
    setInventoryOpen(false)
    setSelectedAbilityId(
      previous =>
        previous === abilityId
          ? null
          : abilityId
    )
  }

  function handleSelectItem(
    itemId: ItemId
  ) {
    if (
      commandsLocked ||
      isBusy ||
      battle.winner ||
      !currentActor ||
      (inventory[itemId] ?? 0) <= 0
    ) {
      return
    }

    const combat =
      ItemRegistry[itemId].combat

    if (!combat) return

    setSelectedAbilityId(null)
    setInventoryOpen(false)

    if (combat.targetMode !== "ally") {
      submitItemAction(itemId, currentActor.id)
      return
    }

    setSelectedItemId(itemId)
  }

  const handleTarget = useCallback(
    (unitId: string) => {
      if (
        commandsLocked ||
        isBusy ||
        battle.winner ||
        !currentActor
      ) {
        return
      }

      if (selectedItemId) {
        if (
          submitItemAction(selectedItemId, unitId)
        ) {
          setSelectedItemId(null)
        }

        return
      }

      if (selectedAbilityId) {
        if (
          act(selectedAbilityId, unitId)
        ) {
          setSelectedAbilityId(null)
        }
      }
    },
    [
      act,
      battle.winner,
      commandsLocked,
      currentActor,
      isBusy,
      selectedAbilityId,
      selectedItemId,
      submitItemAction
    ]
  )

  function handleTick() {
    if (
      commandsLocked ||
      isBusy ||
      battle.winner
    ) {
      return
    }

    setSelectedAbilityId(null)
    setSelectedItemId(null)
    setInventoryOpen(false)
    tick()
  }

  const background =
    getBattleBackground(backgroundId)

  return (
    <div className="ba-screen">
      <audio
        ref={audioRef}
        loop
        autoPlay
      >
        <source
          src="/Hype&Venus.mp3"
          type="audio/mpeg"
        />
      </audio>

      <header className="ba-header">
        <div>
          <div className="ba-eyebrow">
            Battle Axiom
          </div>

          <h1>
            Battle System
          </h1>
        </div>

        <div className="ba-header__status">
          <span className="ba-turn-label">
            {currentActor
              ? `${currentActor.name}'s turn`
              : "Awaiting initiative"}
          </span>

          <button
            className="ba-button"
            onClick={handleTick}
            disabled={
              commandsLocked ||
              isBusy ||
              !!battle.winner
            }
          >
            Next Tick
          </button>
        </div>
      </header>

      {battle.winner &&
        presentation.victoryState ===
          "complete" && (
          <div
            className={[
              "ba-result",
              battle.winner ===
              "player"
                ? "ba-result--victory"
                : "ba-result--defeat"
            ].join(" ")}
          >
            {battle.winner ===
            "player"
              ? "Victory!"
              : "Defeat!"}
          </div>
        )}

      <BattleStage
        units={battle.units}
        background={background}
        presentation={presentation}
        targetIds={targetIds}
        onTarget={handleTarget}
      />

      {dialogueActive &&
        activeDialogueLine && (
          <div className="ba-dialogue-overlay">
            <DialogueBox
              speaker={
                activeDialogueLine.speaker
              }
              portrait={
                activeDialogueLine.portrait
              }
              text={activeDialogueLine.text}
              onContinue={() =>
                setDialogueGate(previous =>
                  advanceDialogue(previous)
                )
              }
            />
          </div>
        )}

      <section className="ba-command">
        {currentActor?.team ===
        "player" ? (
          <div className="ba-command__actions">
            <AbilityBar
              actor={currentActor}
              selectedAbilityId={
                selectedAbilityId
              }
              onSelectAbility={
                handleSelectAbility
              }
              disabled={
                commandsLocked ||
                isBusy ||
                !!battle.winner
              }
            />

            <button
              className="ba-button ba-button--items"
              onClick={() =>
                setInventoryOpen(true)
              }
              disabled={
                commandsLocked ||
                isBusy ||
                !!battle.winner
              }
            >
              Items
            </button>
          </div>
        ) : (
          <div className="ba-command__idle">
            Advance the timeline to begin the
            next turn.
          </div>
        )}

        {selectedAbilityId && (
          <div className="ba-command__hint">
            {isSupportSelected
              ? "Choose an ally to heal."
              : "Choose an enemy to target."}
            <button
              className="ba-button ba-button--small"
              onClick={() =>
                handleSelectAbility(null)
              }
            >
              Cancel
            </button>
          </div>
        )}

        {selectedItem && (
          <div className="ba-command__hint">
            Choose an ally for {selectedItem.name}.
            <button
              className="ba-button ba-button--small"
              onClick={() =>
                setSelectedItemId(null)
              }
            >
              Cancel
            </button>
          </div>
        )}

        {isBusy && (
          <div className="ba-command__hint">
            Resolving action...
          </div>
        )}
      </section>

      <div className="ba-lower">
        <section className="ba-panel ba-panel--details">
          <h2>
            Combat Status
          </h2>

          <div className="ba-details-grid">
            {battle.units.map(unit => (
              <div
                key={unit.id}
                className={`ba-detail ba-detail--${unit.team}`}
              >
                <div className="ba-detail__head">
                  <strong>
                    {unit.name}
                  </strong>

                  <span>
                    {unit.heroClass}
                  </span>

                  <span>
                    HP {unit.hp}/
                    {unit.maxHp}
                  </span>

                  <span>
                    Lv {unit.level}
                  </span>
                </div>

                <div className="ba-detail__stats">
                  ATK {unit.attack} · DEF{" "}
                  {unit.defense} · SPD{" "}
                  {unit.speed} · CRIT{" "}
                  {Math.round(
                    unit.critChance * 100
                  )}
                  % · TL {unit.timeline}
                </div>

                {unit.statuses.length >
                  0 && (
                  <div className="ba-detail__stats">
                    Status:{" "}
                    {unit.statuses
                      .map(
                        status =>
                          status.name
                      )
                      .join(", ")}
                  </div>
                )}

                {unit.team ===
                  "player" && (
                  <>
                    <button
                      className="ba-button ba-button--small"
                      onClick={() =>
                        setExpandedHeroId(
                          previous =>
                            previous ===
                            unit.id
                              ? null
                              : unit.id
                        )
                      }
                      disabled={
                        commandsLocked
                      }
                    >
                      Skills
                    </button>

                    {expandedHeroId ===
                      unit.id && (
                      <div className="ba-detail__skills">
                        {unit.skillTree.map(
                          node => (
                            <button
                              key={node.id}
                              className="ba-button ba-button--small"
                              onClick={() => {
                                unlockSkill(
                                  unit,
                                  node.id
                                )

                                refreshSkills(
                                  value =>
                                    value +
                                    1
                                )
                              }}
                              disabled={
                                commandsLocked ||
                                !getSkillAvailability(
                                  unit,
                                  node
                                ).available
                              }
                            >
                              {node.name} (
                              {node.rank}/
                              {node.maxRank})
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="ba-panel ba-panel--log">
          <BattleLog logs={battle.log} />
        </section>
      </div>

      {battle.relationships.length >
        0 && (
        <section className="ba-panel ba-panel--relationships">
          <h2>
            Relationships
          </h2>

          <div className="ba-relationships-grid">
            {battle.relationships.map(
              relationship => (
                <div
                  key={relationship.id}
                  className="ba-relationship"
                >
                  {relationship.members
                    .map(
                      member =>
                        member.name
                    )
                    .join(" + ")}
                  {" — "}
                  {
                    getRelationshipTier(
                      relationship.points
                    ).name
                  }
                  {" "}
                  {relationship.points}/
                  {RELATIONSHIP_MAX_POINTS}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {inventoryOpen &&
        currentActor?.team ===
          "player" && (
          <BattleInventoryModal
            inventory={inventory}
            onCancel={() =>
              setInventoryOpen(false)
            }
            onSelectItem={handleSelectItem}
          />
        )}
    </div>
  )
}
