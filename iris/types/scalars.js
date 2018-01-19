// @flow
/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
const GraphQLDate = require('graphql-date');
import { GraphQLInputInt } from 'graphql-input-number';

const Amount = new GraphQLInputInt({
  name: 'Amount',
  description:
    'The amount of edges to return. Can be any Int between 1 and 100.',
  min: 1,
  max: 100,
});

const typeDefs = /* GraphQL */ `
	scalar Date
  scalar Amount
`;

const resolvers = {
  Date: GraphQLDate,
  Amount,
};

module.exports = {
  typeDefs,
  resolvers,
};
