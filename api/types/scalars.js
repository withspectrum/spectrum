// @flow
/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
const GraphQLDate = require('graphql-date');
import { GraphQLUpload } from 'apollo-upload-server';
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
