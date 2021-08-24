// @flow
/**
 * The combined schema out of types and resolvers (queries, mutations and subscriptions)
 */
const {
  makeExecutableSchema,
  addSchemaLevelResolveFunction,
} = require('graphql-tools');
const debug = require('debug')('api:resolvers');
const logExecutions = require('graphql-log')({
  logger: debug,
});
const { merge } = require('lodash');
import UserError from './utils/UserError';

const scalars = require('./types/scalars');
const generalTypes = require('./types/general');

const Thread = require('./types/Thread');
const Channel = require('./types/Channel');
const Community = require('./types/Community');
const Message = require('./types/Message');
const Reaction = require('./types/Reaction');
const User = require('./types/User');
const DirectMessageThread = require('./types/DirectMessageThread');
const Invoice = require('./types/Invoice');
const CommunityMember = require('./types/CommunityMember');
const ThreadParticipant = require('./types/ThreadParticipant');

const ThreadQueries = require('./queries/thread');
const channelQueries = require('./queries/channel');
const communityQueries = require('./queries/community');
const messageQueries = require('./queries/message');
const userQueries = require('./queries/user');
const reactionQueries = require('./queries/reaction');
const directMessageThreadQueries = require('./queries/directMessageThread');
const communityMemberQueries = require('./queries/communityMember');

const messageMutations = require('./mutations/message');
const threadMutations = require('./mutations/thread');
const communityMutations = require('./mutations/community');
const channelMutations = require('./mutations/channel');
const userMutations = require('./mutations/user');
const fileMutations = require('./mutations/files');

const Root = /* GraphQL */ `
  # The dummy queries and mutations are necessary because
  # graphql-js cannot have empty root types and we only extend
  # these types later on
  # Ref: apollographql/graphql-tools#293
  type Query {
    dummy: String
  }

  type Mutation {
    dummy: String
  }

  type Subscription {
    dummy: String
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const resolvers = merge(
  {},
  //queries
  scalars.resolvers,
  ThreadQueries,
  channelQueries,
  communityQueries,
  messageQueries,
  userQueries,
  directMessageThreadQueries,
  reactionQueries,
  communityMemberQueries,
  // mutations
  messageMutations,
  threadMutations,
  communityMutations,
  channelMutations,
  userMutations,
  fileMutations
);

if (process.env.NODE_ENV === 'development' && debug.enabled) {
  logExecutions(resolvers);
}

// Create the final GraphQL schema out of the type definitions
// and the resolvers
const schema = makeExecutableSchema({
  typeDefs: [
    scalars.typeDefs,
    generalTypes,
    Root,
    Community,
    CommunityMember,
    Channel,
    Thread,
    ThreadParticipant,
    Message,
    Reaction,
    User,
    DirectMessageThread,
    Invoice,
  ],
  resolvers,
  schemaDirectives: {},
});

if (process.env.REACT_APP_MAINTENANCE_MODE === 'enabled') {
  console.error('\n\n⚠️ ----MAINTENANCE MODE ENABLED----⚠️\n\n');
  addSchemaLevelResolveFunction(schema, () => {
    throw new UserError(
      "We're currently undergoing planned maintenance. We'll be back soon, please check https://twitter.com/withspectrum for ongoing updates!"
    );
  });
}

module.exports = schema;
