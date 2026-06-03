export type Action =
  | {
      type: "ability"

      abilityId: string

      targetId: string
    }

  | {
      type: "wait"
    }