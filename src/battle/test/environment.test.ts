import test from "node:test"
import assert from "node:assert/strict"

import {
  ENVIRONMENTAL_OBJECTS,
  ENVIRONMENTAL_OBJECT_IDS,
  getEnvironmentalObjectsForBackground
} from "../../game/data/EnvironmentalObjectRegistry"
import { regionToStyle } from "../../game/data/environmentalRegion"

function percent(value: string): number {
  return Number.parseFloat(value)
}

function closeTo(
  actual: number,
  expected: number,
  message: string
) {
  assert.ok(
    Math.abs(actual - expected) < 0.01,
    `${message}: expected ${expected}, got ${actual}`
  )
}

test("environmental object registry has stable unique ids", () => {
  assert.equal(
    new Set(ENVIRONMENTAL_OBJECT_IDS).size,
    ENVIRONMENTAL_OBJECT_IDS.length
  )

  for (const id of ENVIRONMENTAL_OBJECT_IDS) {
    assert.equal(
      ENVIRONMENTAL_OBJECTS[id].id,
      id
    )
    assert.ok(
      ENVIRONMENTAL_OBJECTS[id].description.length > 0
    )
  }
})

test("environmental objects are grouped by background", () => {
  assert.deepEqual(
    getEnvironmentalObjectsForBackground("twell").map(
      object => object.id
    ),
    ["twell-windmills", "twell-fountain"]
  )

  assert.deepEqual(
    getEnvironmentalObjectsForBackground(
      "weaponShop"
    ).map(object => object.id),
    ["weapon-shop-stone"]
  )

  assert.deepEqual(
    getEnvironmentalObjectsForBackground("inn").map(
      object => object.id
    ),
    ["inn-hearth"]
  )

  assert.deepEqual(
    getEnvironmentalObjectsForBackground("itemShop"),
    []
  )
})

test("region math is exact when aspect ratios match", () => {
  const style = regionToStyle(
    {
      left: 0.25,
      top: 0.5,
      width: 0.1,
      height: 0.2
    },
    1536,
    1024,
    1536,
    1024,
    "cover"
  )

  closeTo(percent(style.left), 25, "left")
  closeTo(percent(style.top), 50, "top")
  closeTo(percent(style.width), 10, "width")
  closeTo(percent(style.height), 20, "height")
})

test("cover region accounts for centered cropping", () => {
  const style = regionToStyle(
    {
      left: 0.4,
      top: 0.14,
      width: 0.13,
      height: 0.19
    },
    1536,
    1024,
    1100,
    800,
    "cover"
  )

  closeTo(
    percent(style.left),
    39.09,
    "cover left"
  )
  closeTo(
    percent(style.top),
    14,
    "cover top"
  )
  closeTo(
    percent(style.width),
    14.18,
    "cover width"
  )
  closeTo(
    percent(style.height),
    19,
    "cover height"
  )
})

test("contain region accounts for centered letterboxing", () => {
  const style = regionToStyle(
    {
      left: 0.8,
      top: 0.44,
      width: 0.11,
      height: 0.19
    },
    1536,
    1024,
    1100,
    800,
    "contain"
  )

  closeTo(
    percent(style.left),
    80,
    "contain left"
  )
  closeTo(
    percent(style.top),
    44.5,
    "contain top"
  )
  closeTo(
    percent(style.width),
    11,
    "contain width"
  )
  closeTo(
    percent(style.height),
    17.42,
    "contain height"
  )
})
