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

	type ContextPermissions @deprecated(reason:"Use the CommunityMember or ThreadParticipant type to get permissions") {
		communityId: String
		reputation: Int
		isModerator: Boolean
		isOwner: Boolean
		isMember: Boolean
		isBlocked: Boolean
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
	
	input EmailInviteContactInput {
		email: LowercaseString!
		firstName: String
		lastName: String
	}

	input EmailInvitesInput {
		id: ID!
		contacts: [ EmailInviteContactInput ]
		customMessage: String
	}
`;

module.exports = general;
