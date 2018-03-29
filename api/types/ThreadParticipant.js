// @flow
const ThreadParticipant = /* GraphQL */ `
	type ThreadParticipant {
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
