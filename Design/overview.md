Here's the full picture of Battle-Axiom:
Tech Stack: React 19, TypeScript 6, Vite 8, react-router-dom v7 — no backend, fully client-side.
Routes:
- / — Main Menu (New Game → /party)
- /party — Party Selection (pick 3 heroes)
- /world — World Map (click Twell to go there)
- /twell — Twell Town hub (NPCs, inn, sleep sequence)
- /battle — Battle screen (your party vs a goblin)
Architecture:
- Pages layer — MainMenu, WorldMap, TwellTown
- Game layer — GameContext (party + unlock flags), PartySelection, DialogueBox, NPC dialogue files
- Battle layer — fully self-contained tactical system with:
- Timeline-based turn engine
- Unit models, abilities, statuses, passives, relationships, synergies, tag effects, skill trees
- Simple enemy AI
- XP progression + leveling, class-specific growth, authoritative post-battle reward resolution
- Data-driven encounter pools with exclusive solo enemies
- Reusable item/relic purchase rules and environmental examination regions
- UI: BattleView, UnitCard, AbilityBar, BattleLog, BattleResolutionModal, EnvironmentalLayer
State management: React Context (GameContext) + local useState with structuredClone for immutable battle state.
9 heroes (Knight, Priest, Rogue, Mage, etc.), each defined as factory functions in heroRoster.ts.
Active development — several stubs, empty files, and commented-out code throughout.