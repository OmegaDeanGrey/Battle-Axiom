import test from "node:test"
import assert from "node:assert/strict"

import {
  evaluatePurchase
} from "../../game/data/purchaseRules"
import {
  RelicRegistry,
  isRelicId
} from "../../game/data/RelicRegistry"

test("a purchasable item is allowed when gold is sufficient", () => {
  assert.deepEqual(
    evaluatePurchase({
      gold: 100,
      price: 25,
      owned: 0,
      unique: false
    }),
    { allowed: true }
  )
})

test("purchases are blocked when gold is insufficient", () => {
  assert.deepEqual(
    evaluatePurchase({
      gold: 24,
      price: 25,
      owned: 0,
      unique: false
    }),
    {
      allowed: false,
      reason: "gold"
    }
  )
})

test("unique purchases are blocked once owned", () => {
  assert.deepEqual(
    evaluatePurchase({
      gold: 10000,
      price: 100,
      owned: 1,
      unique: true
    }),
    {
      allowed: false,
      reason: "owned"
    }
  )
})

test("negative and non-finite prices are rejected", () => {
  for (const price of [-1, Number.NaN]) {
    assert.deepEqual(
      evaluatePurchase({
        gold: 10000,
        price,
        owned: 0,
        unique: true
      }),
      {
        allowed: false,
        reason: "invalid-price"
      }
    )
  }
})

test("relic registry exposes stable ids and existing prices", () => {
  assert.equal(
    isRelicId("twellianStone"),
    true
  )
  assert.equal(
    isRelicId("notARelic"),
    false
  )
  assert.equal(
    RelicRegistry.twellianStone.price,
    250
  )
  assert.equal(
    RelicRegistry.leatherBracers.price,
    100
  )
})
