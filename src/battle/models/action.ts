export type Action =
  | {
      type: "ability"

      abilityId: string

      targetId: string
    }

  | {
      type: "item"

      itemId: string

      targetId: string
    }

  | {
      type: "wait"
    }
