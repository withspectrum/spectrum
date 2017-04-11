/**
 * The combined schema out of types and resolvers (queries, mutations and subscriptions)
 */
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const { maskErrors } = require('graphql-errors');

const scalars = require('./types/scalars');

const Story = require('./types/Story');
const Frequency = require('./types/Frequency');
const Community = require('./types/Community');
const Message = require('./types/Message');

const storyQueries = require('./queries/story');
const frequencyQueries = require('./queries/frequency');
const communityQueries = require('./queries/community');
const messageQueries = require('./queries/message');

const messageMutations = require('./mutations/message');
const storyMutations = require('./mutations/story');

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
  typeDefs: [scalars.typeDefs, Root, Community, Frequency, Story, Message],
  resolvers: merge(
    {},
    scalars.resolvers,
    storyQueries,
    frequencyQueries,
    communityQueries,
    messageQueries,
    messageMutations,
    storyMutations,
    messageSubscriptions
  ),
});

if (process.env.NODE_ENV === 'production') {
  maskErrors(schema);
}

module.exports = schema;
