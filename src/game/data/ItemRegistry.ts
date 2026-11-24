import type { AbilityEffect } from "../../battle/models/ability"

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"

export type ItemTargetMode =
  | "self"
  | "ally"
  | "none"

export type CombatItemDefinition = {
  targetMode: ItemTargetMode
  allowDefeated?: boolean
  requiresStatusId?: string
  effects: readonly AbilityEffect[]
}

export type ItemDefinition<
  TId extends string = string
> = {
  id: TId
  name: string
  price: number
  image?: string
  description: string
  rarity?: ItemRarity
  combat?: CombatItemDefinition
}

export type ItemId =
  | "potion"
  | "hiPotion"
  | "antidote"

export const ItemRegistry: Record<
  ItemId,
  ItemDefinition<ItemId>
> = {
  potion: {
    id: "potion",
    name: "Potion",
    price: 10,
    image: "/Potion.png",
    description: "Restores 50 HP.",
    rarity: "common",
    combat: {
      targetMode: "ally",
      effects: [
        {
          type: "heal",
          amount: 50
        }
      ]
    }
  },

  hiPotion: {
    id: "hiPotion",
    name: "Hi-Potion",
    price: 25,
    image: "/Hi-Potion.png",
    description: "Restores 150 HP.",
    rarity: "uncommon",
    combat: {
      targetMode: "ally",
      effects: [
        {
          type: "heal",
          amount: 150
        }
      ]
    }
  },

  antidote: {
    id: "antidote",
    name: "Antidote",
    price: 5,
    image: "/Antidote.png",
    description: "Removes Poison.",
    rarity: "common",
    combat: {
      targetMode: "ally",
      requiresStatusId: "poison",
      effects: [
        {
          type: "removeStatus",
          statusId: "poison"
        }
      ]
    }
  }
}

export type ItemInventory = Partial<
  Record<ItemId, number>
>

export function isItemId(
  value: string
): value is ItemId {
  return Object.prototype.hasOwnProperty.call(
    ItemRegistry,
    value
  )
}

export function isBattleConsumable(
  itemId: string
): itemId is ItemId {
  return (
    isItemId(itemId) &&
    Boolean(ItemRegistry[itemId].combat)
  )
}

export function getAvailableBattleItems(
  inventory: Readonly<
    Partial<Record<string, number>>
  >
): ItemId[] {
  return (Object.keys(inventory) as ItemId[])
    .filter(
      itemId =>
        isBattleConsumable(itemId) &&
        (inventory[itemId] ?? 0) > 0
    )
    .sort((a, b) =>
      ItemRegistry[a].name.localeCompare(
        ItemRegistry[b].name
      )
    )
}

export function getItemEffectKinds(
  itemId: ItemId
): AbilityEffect["type"][] {
  return (
    ItemRegistry[itemId].combat?.effects.map(
      effect => effect.type
    ) ?? []
  )
}
