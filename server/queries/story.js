//@flow

/**
 * Story query resolvers
 */
const { getFrequencies } = require('../models/frequency');
const { getCommunities } = require('../models/community');
const { getUsers } = require('../models/user');
const {
  getMessagesByLocationAndThread,
  getMessageCount,
} = require('../models/message');
import paginate from '../utils/paginate-arrays';
import type { LocationTypes } from '../models/message';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    story: (_: any, { id }: { id: string }, { loaders }: GraphQLContext) =>
      loaders.story.load(id),
  },
  Story: {
    frequency: (
      { frequency }: { frequency: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.frequency.load(frequency),
    community: (
      { community }: { community: string },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.community.load(community),
    participants: ({ id, author }: { id: String, author: string }) => {
      return getMessagesByLocationAndThread('messages', id)
        .then(messages =>
          messages
            .map(
              // create an array of user ids
              message => message.sender
            )
            .filter(
              // remove the author from the list
              message => message !== author
            )
            .filter(
              (id, index, self) =>
                // get distinct ids in the array
                self.indexOf(id) === index
            )
        )
        .then(users => getUsers(users));
    },
    isCreator: ({ author }: { author: String }, _: any, { user }: Context) => {
      if (!author) return false;
      return user.uid === author;
    },
    isFrequencyOwner: (
      { frequency }: { frequency: String },
      _: any,
      { user }: Context
    ) => {
      if (!frequency) return false;
      return getFrequencies([frequency]).then(
        data => data[0].subscribers.indexOf(user.uid) > -1
      );
    },
    isCommunityOwner: (
      { community }: { community: String },
      _: any,
      { user }: Context
    ) => {
      if (!community) return false;
      return getCommunities([community]).then(
        data => data[0].members.indexOf(user.uid) > -1
      );
    },
    messageConnection: (
      { id }: { id: String },
      { first = 100, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getMessagesByLocationAndThread('messages', id, {
        first,
        after: cursor,
      })
        .then(messages =>
          paginate(
            messages,
            { first, after: cursor },
            message => message.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(message => ({
            cursor: encode(message.id),
            node: message,
          })),
        }));
    },
    author: (
      { author }: { author: String },
      _: any,
      { loaders }: GraphQLContext
    ) => loaders.user.load(author),
    messageCount: ({ id }: { id: string }) => getMessageCount('messages', id),
  },
};
