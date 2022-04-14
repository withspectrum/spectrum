// @flow
const CommunityMember = /* GraphQL */ `
  type CommunityMember @cacheControl(maxAge: 600) {
    id: ID!
    user: User!
    roles: [String]
    isMember: Boolean
    isModerator: Boolean
    isOwner: Boolean
    isBlocked: Boolean
    isPending: Boolean
    reputation: Int
    lastSeen: Date
  }

  extend type Query {
    communityMember(userId: ID!, communityId: ID!): CommunityMember
  }

  input AddCommunityMemberInput {
    communityId: ID!
  }

  input AddCommunityMembersInput {
    communityIds: [ID!]
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

  input AddPendingCommunityMemberInput {
    communityId: ID!
  }

  input RemovePendingCommunityMemberInput {
    communityId: ID!
  }

  input ApprovePendingCommunityMemberInput {
    userId: ID!
    communityId: ID!
  }

  input BlockPendingCommunityMemberInput {
    userId: ID!
    communityId: ID!
  }

  input AddCommunityMemberWithTokenInput {
    communitySlug: LowercaseString!
    token: String!
  }

  extend type Mutation {
    addCommunityMember(input: AddCommunityMemberInput!): Community
    addCommunityMembers(input: AddCommunityMembersInput!): [Community]
    addCommunityMemberWithToken(
      input: AddCommunityMemberWithTokenInput!
    ): Community
    addPendingCommunityMember(input: AddPendingCommunityMemberInput!): Community
    removePendingCommunityMember(
      input: RemovePendingCommunityMemberInput!
    ): Community
    approvePendingCommunityMember(
      input: ApprovePendingCommunityMemberInput!
    ): CommunityMember
    blockPendingCommunityMember(
      input: BlockPendingCommunityMemberInput!
    ): CommunityMember
    removeCommunityMember(input: RemoveCommunityMemberInput!): Community
    addCommunityModerator(input: AddCommunityModeratorInput!): CommunityMember
    removeCommunityModerator(
      input: RemoveCommunityModeratorInput!
    ): CommunityMember
    blockCommunityMember(input: BlockCommunityMemberInput!): CommunityMember
    unblockCommunityMember(input: UnblockCommunityMemberInput!): CommunityMember
  }
`;

module.exports = CommunityMember;
