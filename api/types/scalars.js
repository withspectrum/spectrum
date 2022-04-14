// @flow
/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
const GraphQLDate = require('graphql-date');
// NOTE(@mxstbr): We can remove this once we stop using makeExecutableSchema
import { GraphQLUpload } from 'apollo-server-express';
import LowercaseString from './custom-scalars/LowercaseString';

const typeDefs = /* GraphQL */ `
  scalar Date
  scalar Upload
  scalar LowercaseString
`;

const resolvers = {
  Date: GraphQLDate,
  Upload: GraphQLUpload,
  LowercaseString: LowercaseString,
};

module.exports = {
  typeDefs,
  resolvers,
};
