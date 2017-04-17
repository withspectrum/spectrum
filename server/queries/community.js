// @flow
/**
 * Community query resolvers
 */
const { getCommunity } = require('../models/community');
const { getFrequenciesByCommunity } = require('../models/frequency');
const { getUsers } = require('../models/user');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';

module.exports = {
  Query: {
    community: (_, { id }) => getCommunity(id),
  },
  Community: {
    frequencyConnection: ({ id }) => ({
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
      const { list, hasMoreItems } = paginate(members, { first, after });
      return getUsers(list).then(users => ({
        pageInfo: {
          hasNextPage: hasMoreItems,
        },
        edges: users.map(user => ({
          cursor: user.uid,
          node: user,
        })),
      }));
    },
  },
};
