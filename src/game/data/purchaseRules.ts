export type PurchaseReason =
  | "gold"
  | "owned"
  | "invalid-price"

export type PurchaseQuote = {
  gold: number
  price: number
  owned: number
  unique: boolean
}

export type PurchaseEvaluation =
  | { allowed: true }
  | { allowed: false; reason: PurchaseReason }

export function evaluatePurchase(
  quote: PurchaseQuote
): PurchaseEvaluation {
  if (
    !Number.isFinite(quote.price) ||
    !Number.isFinite(quote.gold) ||
    quote.price < 0
  ) {
    return {
      allowed: false,
      reason: "invalid-price"
    }
  }

  if (quote.unique && quote.owned > 0) {
    return {
      allowed: false,
      reason: "owned"
    }
  }

  if (quote.gold < quote.price) {
    return {
      allowed: false,
      reason: "gold"
    }
  }

  return { allowed: true }
}
