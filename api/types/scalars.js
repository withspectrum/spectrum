// @flow
/**
 * Custom scalars (data types, like Int, String,...) live in this file,
 * both their type definitions and their resolvers
 */
import GraphQLDate from 'graphql-date';
import { GraphQLUpload } from 'apollo-upload-server';
import LowercaseString from './custom-scalars/LowercaseString';
import RawDraftContentState from './custom-scalars/RawDraftContentState';

export const typeDefs = /* GraphQL */ `
	scalar Date
  scalar Upload
  scalar LowercaseString
  scalar RawDraftContentState
`;

export const resolvers = {
  Date: GraphQLDate,
  Upload: GraphQLUpload,
  LowercaseString,
  RawDraftContentState,
};
