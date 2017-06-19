//@flow
/**
 * The combined schema out of types and resolvers (queries, mutations and subscriptions)
 */
//$FlowFixMe
const { makeExecutableSchema } = require('graphql-tools');
const debug = require('debug')('iris:resolvers');
const logExecutions = require('graphql-log')({
  logger: debug,
});
//$FlowFixMe
const { merge } = require('lodash');
import OpticsAgent from 'optics-agent';

const scalars = require('./types/scalars');
const generalTypes = require('./types/general');

const Thread = require('./types/Thread');
const Channel = require('./types/Channel');
const Community = require('./types/Community');
const Message = require('./types/Message');
const Reaction = require('./types/Reaction');
const User = require('./types/User');
const DirectMessageThread = require('./types/DirectMessageThread');
const Notification = require('./types/Notification');
const Meta = require('./types/Meta');

const ThreadQueries = require('./queries/thread');
const channelQueries = require('./queries/channel');
const communityQueries = require('./queries/community');
const messageQueries = require('./queries/message');
const userQueries = require('./queries/user');
const reactionQueries = require('./queries/reaction');
const directMessageThreadQueries = require('./queries/directMessageThread');
const notificationQueries = require('./queries/notification');
const metaQueries = require('./queries/meta');

const messageMutations = require('./mutations/message');
const threadMutations = require('./mutations/thread');
const reactionMutations = require('./mutations/reaction');
const recurringPaymentMutations = require('./mutations/recurringPayment');
const communityMutations = require('./mutations/community');
const channelMutations = require('./mutations/channel');
const directMessageThreadMutations = require('./mutations/directMessageThread');
const notificationMutations = require('./mutations/notification');
const userMutations = require('./mutations/user');

const messageSubscriptions = require('./subscriptions/message');
const notificationSubscriptions = require('./subscriptions/notification');
const directMessageThreadSubscriptions = require('./subscriptions/directMessageThread');

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

const resolvers = merge(
  {},
  //queries
  scalars.resolvers,
  ThreadQueries,
  channelQueries,
  communityQueries,
  messageQueries,
  userQueries,
  directMessageThreadQueries,
  reactionQueries,
  notificationQueries,
  metaQueries,
  // mutations
  messageMutations,
  threadMutations,
  directMessageThreadMutations,
  reactionMutations,
  recurringPaymentMutations,
  communityMutations,
  channelMutations,
  notificationMutations,
  userMutations,
  // subscriptions
  messageSubscriptions,
  notificationSubscriptions,
  directMessageThreadSubscriptions
);

if (process.env.NODE_ENV === 'development' && debug.enabled) {
  logExecutions(resolvers);
}

// Create the final GraphQL schema out of the type definitions
// and the resolvers
const schema = makeExecutableSchema({
  typeDefs: [
    scalars.typeDefs,
    generalTypes,
    Root,
    Community,
    Channel,
    Thread,
    Message,
    Reaction,
    User,
    DirectMessageThread,
    Notification,
    Meta,
  ],
  resolvers,
});

// Instrument the schema with Apollo Optics
OpticsAgent.instrumentSchema(schema);

module.exports = schema;
