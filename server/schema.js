const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const GraphQLDate = require('graphql-date');

const Story = require('./types/Story');
const Frequency = require('./types/Frequency');
const Community = require('./types/Community');
const Message = require('./types/Message');
const storyQueries = require('./queries/story');
const frequencyQueries = require('./queries/frequency');
const communityQueries = require('./queries/community');
const messageQueries = require('./queries/message');
const messageMutations = require('./mutations/message');

const Query = /* GraphQL */ `
	# Root Query
	type Query {
		stories: [Story!]
		frequency(id: ID!): Frequency
		frequencies: [Frequency!]
		community(id: ID!): Community
		message(id: ID!): Message
	}
`;

const Mutation = /* GraphQL */ `
	input MessageContentInput {
		type: MessageType!
		content: String!
	}

	input MessageInput {
		story: ID!
		message: MessageContentInput!
	}

	# Root Mutation
	type Mutation {
		addMessage(message: MessageInput!): Message
	}
`;

const customScalars = /* GraphQL */ `
	scalar Date
`;

const Schema = /* GraphQL */ `
	schema {
		query: Query
		mutation: Mutation
	}
`;

const customScalarsResolver = {
  Date: GraphQLDate,
};

module.exports = makeExecutableSchema({
  typeDefs: [
    customScalars,
    Schema,
    Mutation,
    Query,
    Community,
    Frequency,
    Story,
    Message,
  ],
  resolvers: merge(
    {},
    customScalarsResolver,
    storyQueries,
    frequencyQueries,
    communityQueries,
    messageQueries,
    messageMutations,
  ),
});
