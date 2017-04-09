const { makeExecutableSchema } = require('graphql-tools');

const Story = require('./types/Story');
const queries = require('./queries');

const Query = /* GraphQL */ `
	# Root Query
	type Query {
		stories: [Story!]
	}
`;

const Schema = /* GraphQL */ `
	schema {
		query: Query
	}
`;

module.exports = makeExecutableSchema({
  typeDefs: [Schema, Query, Story],
  resolvers: {
    Query: queries,
  },
});
