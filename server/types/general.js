/**
 * General, reusable types
 */

const general = /* GraphQL */ `
	type PageInfo {
		hasNextPage: Boolean
		hasPreviousPage: Boolean
	}

	type ChannelPermissions {
		isMember: Boolean
		isBlocked: Boolean
		isPending: Boolean
		isOwner: Boolean
		isModerator: Boolean
	}

	type CommunityPermissions {
		isMember: Boolean
		isBlocked: Boolean
		isOwner: Boolean
		isModerator: Boolean
	}
`;

module.exports = general;
