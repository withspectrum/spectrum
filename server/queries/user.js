/**
 * Story query resolvers
 */
const { getUser, getAllStories } = require('../models/user');
const { getCommunitiesByUser } = require('../models/community');
const { getFrequenciesByUser } = require('../models/frequency');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';

module.exports = {
  Query: {
    user: (_, { id }) => getUser(id),
  },
  User: {
    everything: (
      { uid }: { uid: String },
      { first = 10, after }: PaginationOptions
    ) => {
      // TODO: Make this more performant by doing an actual db query
      return getFrequenciesByUser(uid)
        .then(frequencies =>
          getAllStories(frequencies.map(frequency => frequency.id))
        )
        .then(stories =>
          Promise.all([
            stories,
            paginate(stories.map(story => story.id), { first, after }),
          ])
        )
        .then(([stories, pagination]) => ({
          pageInfo: {
            hasNextPage: pagination.hasMoreItems,
          },
          edges: pagination.list.map(id => ({
            cursor: id,
            node: stories.find(story => story.id === id),
          })),
        }));
    },
    communityConnection: user => ({
      // Don't paginate communities and frequencies of a user
      pageInfo: {
        hasNextPage: false,
      },
      edges: getCommunitiesByUser(user.uid).then(communities =>
        communities.map(community => ({
          node: community,
        }))
      ),
    }),
    frequencyConnection: user => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getFrequenciesByUser(user.uid).then(frequencies =>
        frequencies.map(frequency => ({
          node: frequency,
        }))
      ),
    }),
  },
};
