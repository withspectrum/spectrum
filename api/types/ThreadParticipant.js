// @flow
const ThreadParticipant = /* GraphQL */ `
  type ThreadParticipant @cacheControl(maxAge: 3600) {
    id: ID!
    user: User!
    roles: [String]
    isMember: Boolean
    isModerator: Boolean
    isOwner: Boolean
    isBlocked: Boolean
    reputation: Int
  }
`;

module.exports = ThreadParticipant;
