// @flow
/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
const GraphQLDate = require('graphql-date');
import { GraphQLUpload } from 'apollo-upload-server';

const typeDefs = /* GraphQL */ `
	scalar Date
  scalar Upload
`;

const resolvers = {
  Date: GraphQLDate,
  Upload: GraphQLUpload,
};

module.exports = {
  typeDefs,
  resolvers,
};
