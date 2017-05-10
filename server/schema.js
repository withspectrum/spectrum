//@flow
/**
 * The combined schema out of types and resolvers (queries, mutations and subscriptions)
 */
//$FlowFixMe
const { makeExecutableSchema } = require('graphql-tools');
//$FlowFixMe
const { merge } = require('lodash');
//$FlowFixMe
const { maskErrors } = require('graphql-errors');

const scalars = require('./types/scalars');
const generalTypes = require('./types/general');

const Story = require('./types/Story');
const Frequency = require('./types/Frequency');
const Community = require('./types/Community');
const Message = require('./types/Message');
const Reaction = require('./types/Reaction');
const User = require('./types/User');
const DirectMessageGroup = require('./types/DirectMessageGroup');
const Notification = require('./types/Notification');

const storyQueries = require('./queries/story');
const frequencyQueries = require('./queries/frequency');
const communityQueries = require('./queries/community');
const messageQueries = require('./queries/message');
const userQueries = require('./queries/user');
const reactionQueries = require('./queries/reaction');
const directMessageGroupQueries = require('./queries/directMessageGroup');
const notificationQueries = require('./queries/notification');

const messageMutations = require('./mutations/message');
const storyMutations = require('./mutations/story');
const reactionMutations = require('./mutations/reaction');
const communityMutations = require('./mutations/community');
const frequencyMutations = require('./mutations/frequency');
const directMessageGroupMutations = require('./mutations/directMessageGroup');
const notificationMutations = require('./mutations/notification');
const userMutations = require('./mutations/user');

const messageSubscriptions = require('./subscriptions/message');

const Root = /* GraphQL */ `
	# The dummy queries and mutations are necessary because
	# graphql-js cannot have empty root types and we only extend
	# these types later on
	# Ref: apollographql/graphql-tools#293
	type Query {
		dummy: String
	}

	type Mutation {
		dummy: String
	}

	type Subscription {
		dummy: String
	}

	schema {
		query: Query
		mutation: Mutation
		subscription: Subscription
	}
`;

// Create the final GraphQL schema out of the type definitions
// and the resolvers
const schema = makeExecutableSchema({
  typeDefs: [
    scalars.typeDefs,
    generalTypes,
    Root,
    Community,
    Frequency,
    Story,
    Message,
    Reaction,
    User,
    DirectMessageGroup,
    Notification,
  ],
  resolvers: merge(
    {},
    //queries
    scalars.resolvers,
    storyQueries,
    frequencyQueries,
    communityQueries,
    messageQueries,
    userQueries,
    directMessageGroupQueries,
    reactionQueries,
    notificationQueries,
    // mutations
    messageMutations,
    storyMutations,
    directMessageGroupMutations,
    reactionMutations,
    communityMutations,
    frequencyMutations,
    notificationMutations,
    userMutations,
    // subscriptions
    messageSubscriptions
  ),
});

if (process.env.NODE_ENV === 'production') {
  maskErrors(schema);
}

module.exports = schema;
