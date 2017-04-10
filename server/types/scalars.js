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
