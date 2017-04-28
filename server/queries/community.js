// @flow
/**
 * Community query resolvers
 */
const { getCommunity, getCommunityMetaData } = require('../models/community');
const { getFrequenciesByCommunity } = require('../models/frequency');
const { getUsers } = require('../models/user');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GetCommunityArgs } from '../models/community';
import { encode, decode } from '../utils/base64';

module.exports = {
  Query: {
    community: (_: any, args: GetCommunityArgs) => getCommunity(args),
  },
  Community: {
    frequencyConnection: ({ id }: { id: String }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getFrequenciesByCommunity(id).then(frequencies =>
        frequencies.map(frequency => ({
          node: frequency,
        }))
      ),
    }),
    memberConnection: (
      { members }: { members: Array<string> },
      { first = 10, after }: PaginationOptions
    ) => {
      const { list, hasMoreItems } = paginate(members, {
        first,
        after: decode(after),
      });
      return getUsers(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: encode(user.uid),
          node: user,
        })),
      }));
    },
    metaData: ({ id }: { id: String }) => {
      return getCommunityMetaData(id).then(data => {
        return {
          frequencies: data[0],
          members: data[1],
        };
      });
    },
  },
};
