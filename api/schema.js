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
const ChannelSlackSettings = require('./types/ChannelSlackSettings');
const Community = require('./types/Community');
const CommunitySlackSettings = require('./types/CommunitySlackSettings');
const Message = require('./types/Message');
const Reaction = require('./types/Reaction');
const User = require('./types/User');
const DirectMessageThread = require('./types/DirectMessageThread');
const Notification = require('./types/Notification');
const Meta = require('./types/Meta');
const Invoice = require('./types/Invoice');
const Search = require('./types/Search');
const CommunityMember = require('./types/CommunityMember');
const ThreadParticipant = require('./types/ThreadParticipant');

const ThreadQueries = require('./queries/thread');
const channelQueries = require('./queries/channel');
const communityQueries = require('./queries/community');
const messageQueries = require('./queries/message');
const userQueries = require('./queries/user');
const reactionQueries = require('./queries/reaction');
const directMessageThreadQueries = require('./queries/directMessageThread');
const notificationQueries = require('./queries/notification');
const metaQueries = require('./queries/meta');
const searchQueries = require('./queries/search');
const communityMemberQueries = require('./queries/communityMember');
const communitySlackSettingsQueries = require('./queries/communitySlackSettings');
const channelSlackSettingsQueries = require('./queries/channelSlackSettings');

const messageMutations = require('./mutations/message');
const threadMutations = require('./mutations/thread');
const reactionMutations = require('./mutations/reaction');
const recurringPaymentMutations = require('./mutations/recurringPayment');
const communityMutations = require('./mutations/community');
const channelMutations = require('./mutations/channel');
const directMessageThreadMutations = require('./mutations/directMessageThread');
const notificationMutations = require('./mutations/notification');
const userMutations = require('./mutations/user');
const metaMutations = require('./mutations/meta');
const communityMemberMutations = require('./mutations/communityMember');

const messageSubscriptions = require('./subscriptions/message');
const notificationSubscriptions = require('./subscriptions/notification');
const directMessageThreadSubscriptions = require('./subscriptions/directMessageThread');
const threadSubscriptions = require('./subscriptions/thread');

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
  notificationQueries,
  metaQueries,
  searchQueries,
  communityMemberQueries,
  communitySlackSettingsQueries,
  channelSlackSettingsQueries,
  // mutations
  messageMutations,
  threadMutations,
  directMessageThreadMutations,
  reactionMutations,
  recurringPaymentMutations,
  communityMutations,
  channelMutations,
  notificationMutations,
  userMutations,
  metaMutations,
  communityMemberMutations,
  // subscriptions
  messageSubscriptions,
  notificationSubscriptions,
  directMessageThreadSubscriptions,
  threadSubscriptions
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
    CommunitySlackSettings,
    CommunityMember,
    Channel,
    ChannelSlackSettings,
    Thread,
    ThreadParticipant,
    Message,
    Reaction,
    User,
    DirectMessageThread,
    Notification,
    Meta,
    Invoice,
    Search,
  ],
  resolvers,
});

module.exports = schema;
