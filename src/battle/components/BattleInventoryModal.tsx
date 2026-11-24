import {
  getAvailableBattleItems,
  ItemRegistry,
  type ItemId
} from "../../game/data/ItemRegistry"

import "./BattleInventoryModal.css"

type Props = {
  inventory: Readonly<
    Partial<Record<string, number>>
  >
  onCancel: () => void
  onSelectItem: (itemId: ItemId) => void
}

function effectText(
  itemId: ItemId
): string {
  const combat =
    ItemRegistry[itemId].combat

  if (!combat) return ""

  return combat.effects
    .map(effect => {
      if (effect.type === "heal") {
        return `Restores up to ${effect.amount} HP`
      }

      if (effect.type === "removeStatus") {
        return `Removes ${
          effect.statusId === "poison"
            ? "Poison"
            : effect.statusId
        }`
      }

      if (effect.type === "damage") {
        return `Deals ${effect.amount} damage`
      }

      if (effect.type === "applyStatus") {
        return `Applies ${effect.status.name}`
      }

      return ""
    })
    .join(" · ")
}

function targetText(
  itemId: ItemId
): string {
  const combat =
    ItemRegistry[itemId].combat

  if (!combat) return "None"

  if (combat.targetMode === "self") {
    return "The active hero"
  }

  if (combat.targetMode === "none") {
    return "No target required"
  }

  if (combat.allowDefeated) {
    return "Any ally, including defeated heroes"
  }

  if (combat.requiresStatusId) {
    return `Afflicted allies (${
      combat.requiresStatusId === "poison"
        ? "Poison"
        : combat.requiresStatusId
    })`
  }

  return "Any living ally"
}

export default function BattleInventoryModal({
  inventory,
  onCancel,
  onSelectItem
}: Props) {
  const itemIds =
    getAvailableBattleItems(inventory)

  return (
    <div
      className="battle-inventory-overlay"
      onClick={onCancel}
    >
      <div
        className="battle-inventory-modal"
        onClick={event =>
          event.stopPropagation()
        }
      >
        <button
          className="battle-inventory-close"
          onClick={onCancel}
        >
          ×
        </button>

        <div className="battle-inventory-eyebrow">
          Battle Supplies
        </div>

        <h2>Items</h2>

        {itemIds.length === 0 ? (
          <p className="battle-inventory-empty">
            No combat-usable items available.
          </p>
        ) : (
          <div className="battle-inventory-list">
            {itemIds.map(itemId => {
              const item =
                ItemRegistry[itemId]

              return (
                <button
                  key={itemId}
                  type="button"
                  className="battle-inventory-item"
                  onClick={() =>
                    onSelectItem(itemId)
                  }
                >
                  {item.image && (
                    <img
                      className="battle-inventory-item__image"
                      src={item.image}
                      alt={item.name}
                    />
                  )}

                  <span className="battle-inventory-item__body">
                    <span className="battle-inventory-item__title">
                      <strong>
                        {item.name}
                      </strong>
                      <span>
                        x{inventory[itemId] ?? 0}
                      </span>
                    </span>

                    <span className="battle-inventory-item__description">
                      {item.description}
                    </span>

                    <span className="battle-inventory-item__meta">
                      Effect: {effectText(itemId)}
                    </span>

                    <span className="battle-inventory-item__meta">
                      Targets: {targetText(itemId)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
