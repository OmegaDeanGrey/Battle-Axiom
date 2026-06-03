import { useBattle } from "./battle/react/useBattle"
import { useState } from "react"
import { createWolf } from "./battle/units/heroes/wolf"
import { createGoblin } from "./battle/units/enemies/goblin"

import { unlockSkill } from "./battle/progression/unlockSkill"

export default function App() {
  const units = [
  createWolf(),
  createGoblin()
]
  

  const { battle, tick, act } = useBattle(units)

  const [selectedAbilityId, setSelectedAbilityId] =
    useState<string | null>(null)

  const currentActor = battle.units.find(
    u => u.id === battle.currentActorId
  )

  const playerUnits = battle.units.filter(
    u => u.team === "player"
  )

  const enemyUnits = battle.units.filter(
    u => u.team === "enemy"
  )

  return (
    <div style={{ padding: 20 }}>
      <h1>Battle System</h1>

      {battle.winner && (
        <h2>
          {battle.winner === "player"
            ? "Victory!"
            : "Defeat!"}
        </h2>
      )}

      <button onClick={tick} disabled={!!battle.winner}>
        Next Tick
      </button>

      {/* CURRENT ACTOR */}
      <div style={{ marginTop: 10 }}>
        Current Actor:{" "}
        {currentActor?.name || "None"}
      </div>

      {/* RELATIONSHIPS */}
      <h2>Relationships</h2>
      {battle.relationships.map(rel => (
        <div key={rel.id} style={{ marginBottom: 10 }}>
          {rel.name} - Level {rel.level}
        </div>
      ))}

      {/* ACTION UI */}
      {currentActor?.team === "player" && (
        <div style={{ marginTop: 20 }}>
          <h2>{currentActor.name}'s Turn</h2>

          {currentActor.abilities.map(ability => (
            <button
              key={ability.id}
              onClick={() =>
                setSelectedAbilityId(ability.id)
              }
              style={{
                marginRight: 10,
                padding: "8px 12px"
              }}
              disabled={!!battle.winner}
            >
              {ability.name}
            </button>
          ))}

          {selectedAbilityId && (
            <div style={{ marginTop: 10 }}>
              Select an enemy target
            </div>
          )}
        </div>
      )}

      {/* PLAYER UNITS */}
      <h2>Your Party</h2>
      {playerUnits.map(u => (
        <div
          key={u.id}
          style={{
            marginBottom: 10,
            border: "1px solid white",
            padding: 10
          }}
        >
          <strong>{u.name}</strong>
          <div>HP: {u.hp}</div>
          <div>Level: {u.level}</div>
          <div>Attack: {u.attack}</div>
          <div>Defense: {u.defense}</div>
          <div>Speed: {u.speed}</div>
          <div>XP: {u.xp}</div>
          <div>Skill Points: {u.skillPoints}</div>
          <div>Timeline: {u.timeline}</div>

          {/* Skill Tree */}
          <div style={{ marginTop: 10 }}>
            {u.skillTree.map(node => (
              <button
                key={node.id}
                onClick={() =>
                  unlockSkill(u, node.id)
                }
                disabled={
                  u.skillPoints < node.cost ||
                  node.unlocked
                }
                style={{ marginRight: 5 }}
              >
                {node.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* ENEMY UNITS */}
      <h2>Enemies</h2>
      {enemyUnits.map(u => (
        <div
          key={u.id}
          style={{
            marginBottom: 10,
            border: "1px solid red",
            padding: 10
          }}
          onClick={() => {
  if (!selectedAbilityId || !currentActor) return
  if (u.team === currentActor.team) return

  act(selectedAbilityId, u.id)

  setSelectedAbilityId(null)
}}
        >
          
          <strong>{u.name}</strong>
          <div>HP: {u.hp}</div>
          <div>Level: {u.level}</div>
          <div>Attack: {u.attack}</div>
          <div>Defense: {u.defense}</div>
          <div>Speed: {u.speed}</div>
          <div>Timeline: {u.timeline}</div>
        </div>
      ))}

      {/* LOG */}
      <h2>Log</h2>
      <div style={{ fontFamily: "monospace" }}>
        {battle.log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  )
}