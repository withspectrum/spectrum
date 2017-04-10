const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const Story = require('./types/Story');
const Frequency = require('./types/Frequency');
const Community = require('./types/Community');
const Message = require('./types/Message');
const storyQueries = require('./queries/story');
const frequencyQueries = require('./queries/frequency');
const communityQueries = require('./queries/community');

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

const Schema = /* GraphQL */ `
	schema {
		query: Query
	}
`;

module.exports = makeExecutableSchema({
  typeDefs: [Schema, Query, Community, Frequency, Story, Message],
  resolvers: merge({}, storyQueries, frequencyQueries, communityQueries),
});
