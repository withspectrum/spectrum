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
		receiveNotifications: Boolean
	}

	type CommunityPermissions {
		isMember: Boolean
		isBlocked: Boolean
		isOwner: Boolean
		isModerator: Boolean
		receiveNotifications: Boolean
		reputation: Int
	}

  input File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

	type RecurringPayment {
		plan: String
		amount: String
		createdAt: String
		status: String
	}

	type ContextPermissions {
		reputation: Int
		isModerator: Boolean
		isOwner: Boolean
	}
`;

module.exports = general;
