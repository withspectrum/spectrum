// @flow
/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
import GraphQLDate from 'graphql-date';
import { GraphQLInputInt } from 'graphql-input-number';
import UserError from '../utils/UserError';

const typeDefs = /* GraphQL */ `
	scalar Date
  scalar PaginationAmount
`;

const resolvers = {
  Date: GraphQLDate,
  PaginationAmount: GraphQLInputInt({
    name: 'PaginationAmount',
    description: 'An Int between 1 and 100, not more and not less.',
    error: ({ value }) => {
      throw new UserError(
        `Invalid amount ${value} specified, has to be more than 1 and less than 100.`
      );
    },
    min: 1,
    max: 100,
  }),
};

module.exports = {
  typeDefs,
  resolvers,
};
