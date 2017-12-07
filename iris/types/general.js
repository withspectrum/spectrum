// @flow
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
		communityId: String
		reputation: Int
		isModerator: Boolean
		isOwner: Boolean
	}

	type GrowthDataCounts {
    growth: Float
    currentPeriodCount: Int
    prevPeriodCount: Int
  }

  type GrowthData {
    count: Int
    weeklyGrowth: GrowthDataCounts
    monthlyGrowth: GrowthDataCounts
    quarterlyGrowth: GrowthDataCounts
  }
`;

module.exports = general;
