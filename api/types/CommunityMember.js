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
  }

  extend type Query {
    communityMember(userId: ID!, communityId: ID!): CommunityMember
  }
`;

module.exports = CommunityMember;
