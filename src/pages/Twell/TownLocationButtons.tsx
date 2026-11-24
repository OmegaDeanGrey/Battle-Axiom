import "./TownLocationButtons.css"

import type { Location } from "./LocationModal"

interface Props {
  onLocationClick: (location: Location) => void
  onExit: () => void
  onVillagerClick: () => void
  onTwellSistersClick: () => void
  windmillRowUnlocked: boolean
  mayorUnlocked: boolean
  questBoardUnlocked: boolean
  itemShopUnlocked: boolean
  weaponShopUnlocked: boolean
  playing: boolean
  onToggleAudio: () => void
}

export default function TownLocationButtons({
  onLocationClick,
  onExit,
  onVillagerClick,
  onTwellSistersClick,
  windmillRowUnlocked,
  mayorUnlocked,
  questBoardUnlocked,
  itemShopUnlocked,
  weaponShopUnlocked,
  playing,
  onToggleAudio,
}: Props) {
  return (
    <>
      {windmillRowUnlocked && (
        <button
          className="twell-button"
          id="windmill-row"
          onClick={() => onLocationClick("windmillRow")}
        >
          Windmill Row
        </button>
      )}

      {mayorUnlocked && (
        <button
          className="twell-button"
          id="mayor"
          onClick={() => onLocationClick("mayor")}
        >
          Mayor
        </button>
      )}

      {questBoardUnlocked && (
        <button
          className="twell-button"
          id="quest-board"
          onClick={() => onLocationClick("questBoard")}
        >
          Quest Board
        </button>
      )}

      <button
        className="twell-button"
        id="inn"
        onClick={() => onLocationClick("inn")}
      >
        Inn
      </button>

      {itemShopUnlocked && (
        <button
          className="twell-button"
          id="item-shop"
          onClick={() => onLocationClick("itemShop")}
        >
          Item Shop
        </button>
      )}

      <button
        id="villager1"
        className="npc-marker"
        onClick={onVillagerClick}
      >
        ▼
      </button>
      <button
        id="twell-sisters"
        className="npc-marker"
        onClick={onTwellSistersClick}
      >
        ▼
      </button>

      {weaponShopUnlocked && (
        <button
          className="twell-button"
          id="weapon-shop"
          onClick={() => onLocationClick("weaponShop")}
        >
          Weapon Shop
        </button>
      )}

      <button
        className="twell-button"
        id="exittwellbutton"
        onClick={onExit}
      >
        Exit Town
      </button>

      <button
        onClick={onToggleAudio}
        id="playbuttontwell"
        className={playing ? "play-btn playing" : "play-btn"}
      >
        {playing ? "| |" : "Play"}
      </button>
    </>
  )
}
