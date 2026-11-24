export type EnvironmentalRegion = {
  left: number
  top: number
  width: number
  height: number
}

export type EnvironmentalObjectId =
  | "twell-windmills"
  | "twell-fountain"
  | "weapon-shop-stone"
  | "inn-hearth"

export type BackgroundFit =
  | "cover"
  | "contain"

export type EnvironmentalObjectDefinition = {
  id: EnvironmentalObjectId
  backgroundId: string
  backgroundImage: string
  imageWidth: number
  imageHeight: number
  fit: BackgroundFit
  region: EnvironmentalRegion
  name: string
  prompt: string
  description: string
  firstTimeDescription?: string
}

export const ENVIRONMENTAL_OBJECTS: Readonly<
  Record<
    EnvironmentalObjectId,
    EnvironmentalObjectDefinition
  >
> = {
  "twell-windmills": {
    id: "twell-windmills",
    backgroundId: "twell",
    backgroundImage: "/Twell.png",
    imageWidth: 1536,
    imageHeight: 1024,
    fit: "cover",
    region: {
      left: 0.4,
      top: 0.14,
      width: 0.13,
      height: 0.19
    },
    name: "Windmill Row",
    prompt: "Examine the turning sails",
    description:
      "The sails keep turning even when the path below them is still. Flour dust hangs in the warm air, and the whole row seems to breathe with the hill.",
    firstTimeDescription:
      "You watch the blades turn above Twell. The rhythm is older than any mayor, and the millers swear it has never once stopped."
  },
  "twell-fountain": {
    id: "twell-fountain",
    backgroundId: "twell",
    backgroundImage: "/Twell.png",
    imageWidth: 1536,
    imageHeight: 1024,
    fit: "cover",
    region: {
      left: 0.22,
      top: 0.59,
      width: 0.09,
      height: 0.13
    },
    name: "Square Fountain",
    prompt: "Listen to the fountain",
    description:
      "Water slips over the carved rim in two thin threads. Coins glint beneath the surface, small wishes kept by the square.",
    firstTimeDescription:
      "You pause by the fountain. Travelers say a coin dropped here returns home faster than the traveler does."
  },
  "weapon-shop-stone": {
    id: "weapon-shop-stone",
    backgroundId: "weaponShop",
    backgroundImage: "/WeaponShop.png",
    imageWidth: 1536,
    imageHeight: 1024,
    fit: "contain",
    region: {
      left: 0.8,
      top: 0.44,
      width: 0.11,
      height: 0.19
    },
    name: "Twellian Stone Display",
    prompt: "Examine the stone display",
    description:
      "The stone rests on worn velvet, its surface catching the lamplight. Cleo has arranged the relics as though each one were a story waiting to be told.",
    firstTimeDescription:
      "You study the display beside Cleo's counter. She notices your interest and smiles, but says nothing."
  },
  "inn-hearth": {
    id: "inn-hearth",
    backgroundId: "inn",
    backgroundImage: "/TwellInn.png",
    imageWidth: 1536,
    imageHeight: 1024,
    fit: "cover",
    region: {
      left: 0.09,
      top: 0.55,
      width: 0.1,
      height: 0.19
    },
    name: "Inn Hearth",
    prompt: "Warm yourself by the hearth",
    description:
      "The fire cracks softly beneath the blackened mantel. A circle of chairs faces it, each one worn smooth by travelers who needed a quiet place to land.",
    firstTimeDescription:
      "You stand before the hearth. For a moment the noise of the common room fades, and the fire sounds almost like a voice."
  }
}

export const ENVIRONMENTAL_OBJECT_IDS =
  Object.keys(
    ENVIRONMENTAL_OBJECTS
  ) as EnvironmentalObjectId[]

export function getEnvironmentalObjectsForBackground(
  backgroundId: string
): EnvironmentalObjectDefinition[] {
  return ENVIRONMENTAL_OBJECT_IDS
    .map(id => ENVIRONMENTAL_OBJECTS[id])
    .filter(
      object =>
        object.backgroundId === backgroundId
    )
}
