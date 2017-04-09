const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const Story = require('./types/Story');
const Frequency = require('./types/Frequency');
const storyQueries = require('./queries/story');
const frequencyQueries = require('./queries/frequency');

const Query = /* GraphQL */ `
	# Root Query
	type Query {
		stories: [Story!]
		frequency(id: ID!): Frequency
		frequencies: [Frequency!]
	}
`;

const Schema = /* GraphQL */ `
	schema {
		query: Query
	}
`;

module.exports = makeExecutableSchema({
  typeDefs: [Schema, Query, Frequency, Story],
  resolvers: merge({}, storyQueries, frequencyQueries),
});
