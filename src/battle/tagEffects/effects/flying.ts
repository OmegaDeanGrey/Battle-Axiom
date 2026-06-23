export const FlyingEffect = {

  tag: "Flying",

  name: "Aerial Advantage",

  description:
    "Flying units take reduced damage from melee attacks.",

  effects: [

    {
      type: "damageReduction",

      againstTag: "Melee",

      value: 20

    }

  ]

}