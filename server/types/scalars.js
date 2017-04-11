/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
const GraphQLDate = require('graphql-date');

const typeDefs = /* GraphQL */ `
	scalar Date
`;

const resolvers = {
  Date: GraphQLDate,
};

module.exports = {
  typeDefs,
  resolvers,
};
