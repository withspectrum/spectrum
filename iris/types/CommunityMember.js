// @flow
const CommunityMember = /* GraphQL */ `
type CommunityMember {
  id: ID!
  user: User!
  roles: [String]
  isMember: Boolean
  isModerator: Boolean
  isOwner: Boolean
  isBlocked: Boolean
  reputation: Int
}

extend type Query {
  communityMember(userId: ID!, communityId: ID!): CommunityMember		
}

input AddCommunityMemberInput {
  communityId: ID!
}

input RemoveCommunityMemberInput {
  communityId: ID!
}

input AddCommunityModeratorInput {
  userId: ID!
  communityId: ID!
}

input RemoveCommunityModeratorInput {
  userId: ID!
  communityId: ID!
}

input BlockCommunityMemberInput {
  userId: ID!
  communityId: ID!
}

input UnblockCommunityMemberInput {
  userId: ID!
  communityId: ID!
}

extend type Mutation {
  addCommunityMember(input: AddCommunityMemberInput!): Community
  removeCommunityMember(input: RemoveCommunityMemberInput!): Community
  addCommunityModerator(input: AddCommunityModeratorInput!): CommunityMember
  removeCommunityModerator(input: RemoveCommunityModeratorInput!): CommunityMember
  blockCommunityMember(input: BlockCommunityMemberInput!): CommunityMember
  unblockCommunityMember(input: UnblockCommunityMemberInput!): CommunityMember
}
`;

module.exports = CommunityMember;
