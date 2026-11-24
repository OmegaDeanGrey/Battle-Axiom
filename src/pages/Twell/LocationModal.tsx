import "./LocationModal.css"

import { useState } from "react"
import { useGame } from "../../game/context/GameContext"
import EnvironmentalLayer from "../../game/components/EnvironmentalLayer"
import {
  ItemRegistry,
  type ItemId
} from "../../game/data/ItemRegistry"
import { RelicRegistry, 
  type RelicId  } from "../../game/data/RelicRegistry"
import type { InventoryId } from "../../game/context/GameContext"

export type Location =
  | "weaponShop"
  | "itemShop"
  | "windmillRow"
  | "questBoard"
  | "mayor"
  | "inn"
  | null

interface Props {
  activeLocation: Location
  onClose: () => void
  onInnPatron1Click: () => void
  onInnPatron2Click: () => void
  onInnKeeperClick: () => void
  onSebastianClick: () => void
  onSleep: () => void
  onMayorClick: () => void
  onWindmillMillerClick: () => void
  onWindmillApprenticeClick: () => void
  onWindmillTravelerClick: () => void
  onExitTwell: () => void
  sleepingQuartersUnlocked: boolean
  shopMenuOpen: boolean
  onCleoClick: () => void
  weaponShopMenuOpen: boolean
  setWeaponShopMenuOpen: (open: boolean) => void
  setShopMenuOpen: (open: boolean) => void
}

const locationData: Record<
  Exclude<Location, null>,
  { title: string; background: string }
> = {
  weaponShop: {
    title: "Weapon Shop",
    background: "/WeaponShop.png",
  },
  itemShop: {
    title: "Item Shop",
    background: "/ItemShopInterior.png",
  },
  windmillRow: {
    title: "Windmill Row",
    background: "/WindmillRow.png",
  },
  questBoard: {
    title: "Quest Board",
    background: "/QuestBoard.png",
  },
  mayor: {
    title: "Mayor's Office",
    background: "/MayorsOffice.png",
  },
  inn: {
    title: "Inn",
    background: "/TwellInn.png",
  },
}

export default function LocationModal({
  activeLocation,
  onClose,
  onInnPatron1Click,
  onInnPatron2Click,
  onInnKeeperClick,
  onSebastianClick,
  onMayorClick,
  onWindmillMillerClick,
  onWindmillApprenticeClick,
  onWindmillTravelerClick,
  onExitTwell,
  onCleoClick,
  onSleep,
  weaponShopMenuOpen,
  setWeaponShopMenuOpen,
  sleepingQuartersUnlocked,
  shopMenuOpen,
  setShopMenuOpen,
}: Props) {
  const [showSleepPrompt, setShowSleepPrompt] = useState(false)
  const [tavernBubbleOpen, setTavernBubbleOpen] = useState(false)
  const [selectedShopItem, setSelectedShopItem] =
  useState<ItemId | null>(null)
const [selectedRelic, setSelectedRelic] =
  useState<RelicId | null>(null)
  const [purchaseMessage, setPurchaseMessage] =
    useState("")
  const [pendingPurchase, setPendingPurchase] =
    useState<InventoryId | null>(null)

const selectedRelicData = selectedRelic
  ? RelicRegistry[selectedRelic]
  : null

      const {
  gold,
  inventory,
  purchase
} = useGame()

  if (!activeLocation) return null



  const data = locationData[activeLocation]

const selectedItemData =
  selectedShopItem
    ? ItemRegistry[selectedShopItem]
    : null

function buySelectedItem() {
  if (!selectedShopItem || !selectedItemData) {
    return
  }

  setPurchaseMessage("")

  const outcome = purchase(
    selectedShopItem,
    selectedItemData.price
  )

  setPurchaseMessage(
    outcome.ok
      ? `${selectedItemData.name} purchased.`
      : outcome.reason === "gold"
        ? "Not enough gold."
        : "This purchase is not available."
  )
}

function selectRelic(id: RelicId) {
  setSelectedRelic(id)
  setPurchaseMessage("")
  setPendingPurchase(null)
}

function buySelectedRelic() {
  if (!selectedRelic || !selectedRelicData) {
    return
  }

  if (pendingPurchase === selectedRelic) {
    return
  }

  setPendingPurchase(selectedRelic)
  setPurchaseMessage("")

  const outcome = purchase(
    selectedRelic,
    selectedRelicData.price,
    { unique: true }
  )

  if (!outcome.ok) {
    setPendingPurchase(null)
    setPurchaseMessage(
      outcome.reason === "gold"
        ? "Not enough gold."
        : "Already owned."
    )
    return
  }

  setPurchaseMessage(
    `${selectedRelicData.name} added to your inventory.`
  )
}

  return (
    <div className="modal-overlay">
      <div
        className="town-modal"
        style={
          activeLocation === "inn"
            ? {}
            : { backgroundImage: `url(${data.background})` }
        }
      >
        <h1>{data.title}</h1>

        {activeLocation === "inn" && (
          <div
            id="twellinn"
            style={{
              backgroundImage: "url('/TwellInn.png')",
            }}
          >
          
            <EnvironmentalLayer backgroundId="inn" />

            <button className="close-button" onClick={onClose}>
              X
            </button>

            <video className="fire-video" autoPlay loop muted playsInline>
              <source src="/fire.mp4" type="video/mp4" />
            </video>

            <div className="candle candle1">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle2">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle3">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle4">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle5">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>
            <div className="candle candle6">
              <div className="flame"></div>
              <div className="glow"></div>
            </div>

            <button
              id="innpatron1"
              className="npc-marker"
              onClick={onInnPatron1Click}
            >
              ▼
            </button>

            <button
              id="innpatron2"
              className="npc-marker"
              onClick={onInnPatron2Click}
            >
              ▼
            </button>

            <button
              className="speaktoinnkeeper"
              onClick={onInnKeeperClick}
            >
              Speak With InnKeeper
            </button>

            {sleepingQuartersUnlocked && (
              <button
                className="speaktoinnkeeper"
                id="sleepingquarters"
                onClick={() => setShowSleepPrompt(true)}
              >
                Sleeping Quarters
              </button>
            )}

            {showSleepPrompt && (
              <div className="sleep-prompt-overlay">
                <div className="sleep-prompt">
                  <p>Rest for the night?</p>
                  <div className="sleep-prompt-buttons">
                    <button
                      className="speaktoinnkeeper"
                      onClick={() => {
                        setShowSleepPrompt(false)
                        onSleep()
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="speaktoinnkeeper"
                      onClick={() => setShowSleepPrompt(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeLocation === "weaponShop" && (
          <div
            id="weapon-shop-modal"
            style={{
              backgroundImage: "url('/WeaponShop.png')",
            }}
          >
            <EnvironmentalLayer backgroundId="weaponShop" />

            <button
              className="weapon-shop-close"
              onClick={onClose}
              aria-label="Close Weapon Shop"
            >
              X
            </button>

            <button
              id="cleo-marker"
              className="npc-marker"
              onClick={onCleoClick}
              aria-label="Speak to Cleo"
              title="Speak to Cleo"
            >
              ▼
            </button>
            {weaponShopMenuOpen && (
  <>
                      {/* AMETHYST BROOCH */}
          <button
            id="amethyst-marker"
            className="relic-marker"
            onClick={() => selectRelic("amethystBrooch")}
            title="Inspect Amethyst Brooch"
          >
            ▼
          </button>

          {/* LEATHER BRACERS */}
          <button
            id="bracers-marker"
            className="relic-marker"
            onClick={() => selectRelic("leatherBracers")}
            title="Inspect Leather Bracers"
          >
            ▼
          </button>

          {/* TWELLIAN STONE */}
          <button
            id="twellian-stone"
            className="relic-marker"
            onClick={() => selectRelic("twellianStone")}
            title="Inspect Twellian Stone"
          >
            ▼
          </button>

          {/* ANCIENT HELM */}
          <button
            id="helm-marker"
            className="relic-marker"
            onClick={() => selectRelic("ancientHelm")}
            title="Inspect Ancient Helm"
          >
            ▼
          </button>
          {weaponShopMenuOpen && selectedRelicData && (
  <div className="relic-inspection">
    <button
      className="relic-inspection-close"
      onClick={() => setSelectedRelic(null)}
    >
      X
    </button>

    <h2>{selectedRelicData.name}</h2>

    <img
      src={selectedRelicData.image}
      alt={selectedRelicData.name}
      className="relic-image"
    />

    <p>{selectedRelicData.description}</p>

    <p>Rarity: {selectedRelicData.rarity}</p>

    <p>Price: {selectedRelicData.price}g</p>

    <p>Gold: {gold}g</p>

    {(inventory[selectedRelicData.id] ?? 0) > 0 && (
      <p className="relic-owned">Owned</p>
    )}

    <button
      className="relic-buy-button"
      onClick={buySelectedRelic}
      disabled={
        (inventory[selectedRelicData.id] ?? 0) > 0 ||
        gold < selectedRelicData.price ||
        pendingPurchase === selectedRelicData.id
      }
    >
      {(inventory[selectedRelicData.id] ?? 0) > 0
        ? "Already Owned"
        : "Buy Relic"}
    </button>

    {purchaseMessage && (
      <p className="relic-purchase-feedback" role="status">
        {purchaseMessage}
      </p>
    )}

    <button className="relic-button-close" onClick={() => setSelectedRelic(null)}>
      Return to Shop
    </button>
  </div>
)}
          </>
)}

           {weaponShopMenuOpen && (
  <>
    <div className="weapon-shop-intro">
      <h2>Cleo's Relics</h2>
      <p>Click on a Relic to view</p>
    </div>

    <button
      className="weapon-shop-leave"
      onClick={() => {
        setWeaponShopMenuOpen(false)
        setSelectedRelic(null)
      }}
    >
      Leave Shop
    </button>
  </>
)}
          </div>
        )}

        {activeLocation === "itemShop" && (
          
          <div
            id="ItemShopInterior"
              style={{
              backgroundImage: "url('/ItemShopInterior.png')",
            }}>
                <button className="close-button" onClick={onClose}>
              X
            </button>
            <button
              className="speaktoitemclerk"
              onClick={onSebastianClick}
            >
              Sebastian
            </button>

{shopMenuOpen && (
  <div className="shop-menu">
    <button className="close-button" onClick={onClose}>
    X
    </button>
    <h2>Sebastian's Goods</h2>

    <button onClick={() => setSelectedShopItem("potion")} className="shop-item" id="twell-potion">Potion - 10g</button>
    <button onClick={() => setSelectedShopItem("hiPotion")} className="shop-item" id="twell-hi-potion">Hi-Potion - 25g</button>
    <button onClick={() => setSelectedShopItem("antidote")} className="shop-item" id="twell-antidote">Antidote - 5g</button>
    <button
      className="exitbutton"
      onClick={() => setShopMenuOpen(false)}
    >
      Leave Shop
    </button>
  </div>
  )
}
{activeLocation === "itemShop" && shopMenuOpen && (
  <div className="shop-left-panel">

    <h2>Party</h2>

    <p>
      Gold: {gold}g
    </p>

    <h3>Inventory</h3>

    {Object.entries(inventory).length === 0 ? (
  <p>No items yet.</p>
) : (
  Object.entries(inventory).map(([itemId, quantity]) => (
    <p key={itemId}>
      {itemId}: {quantity}
    </p>
  ))
)}

  </div>
)}
{activeLocation === "itemShop" && shopMenuOpen && selectedItemData && (
  <div className="shop-right-panel">

    <h2>{selectedItemData.name}</h2>

    <img
      src={selectedItemData.image}
      alt={selectedItemData.name}
      className="shop-item-image"
    />

    <p>{selectedItemData.description}</p>

    <p>Price: {selectedItemData.price}g</p>
  <button
  className="shop-action-button"
  onClick={buySelectedItem}
  disabled={gold < selectedItemData.price}
>
  Buy
</button>
  {purchaseMessage && (
    <p className="relic-purchase-feedback" role="status">
      {purchaseMessage}
    </p>
  )}
  </div>
)}
</div>
          
        )}

        {activeLocation === "windmillRow" && (
          <div
            id="windmill-row-modal"
            style={{
              backgroundImage: "url('/WindmillRow.png')",
            }}
          >
            <button
              className="windmill-close-button"
              onClick={() => {
                setTavernBubbleOpen(false)
                onClose()
              }}
              aria-label="Close Windmill Row"
            >
              X
            </button>

            <button
              id="windmill-miller-marker"
              className="npc-marker"
              onClick={onWindmillMillerClick}
              aria-label="Speak to Miller Garrick"
              title="Speak to Miller Garrick"
            >
              ▼
            </button>

            <button
              id="windmill-apprentice-marker"
              className="npc-marker"
              onClick={onWindmillApprenticeClick}
              aria-label="Speak to Milla"
              title="Speak to Milla"
            >
              ▼
            </button>

            <button
              id="windmill-traveler-marker"
              className="npc-marker"
              onClick={onWindmillTravelerClick}
              aria-label="Speak to Old Rowan"
              title="Speak to Old Rowan"
            >
              ▼
            </button>

            <button
              id="windmill-tavern-entrance"
              className="tavern-entrance"
              onClick={() => setTavernBubbleOpen(true)}
            >
              Tavern Entrance
            </button>

            {tavernBubbleOpen && (
              <div
                className="tavern-bubble"
                onClick={() => setTavernBubbleOpen(false)}
                onAnimationEnd={() => setTavernBubbleOpen(false)}
              >
                <p>we do not have time for that now, the Mayor needs us</p>
              </div>
            )}

            <button
              id="windmill-exit-twell"
              className="windmill-exit-button"
              onClick={onExitTwell}
            >
              Exit To Outskirts
            </button>
          </div>
        )}

        {activeLocation === "questBoard" && (
          <div>Available quests go here</div>
        )}

       {activeLocation === "mayor" && (
        <div
          id="mayors-office"
          style={{
            backgroundImage: "url('/MayorsOffice.png')",
          }}
        >
          <button className="close-button" onClick={onClose}>
            X
          </button>

          <button
            id="mayor-marker"
            className="npc-marker"
            onClick={onMayorClick}
            aria-label="Speak to Mayor"
          >
            ▼
          </button>
        </div>
      )}
      </div>
    </div>
  )
}
