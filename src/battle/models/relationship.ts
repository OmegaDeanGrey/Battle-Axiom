export type RelationshipMember = {
  heroId: string
  name: string
  heroClass: string
  portrait: string
}

export type Relationship = {
  id: string
  members: RelationshipMember[]
  points: number
}
