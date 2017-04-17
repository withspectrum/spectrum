/**
 * Story query resolvers
 */
const { getUser } = require('../models/user');
const { getCommunitiesByUser } = require('../models/community');
const { getFrequenciesByUser } = require('../models/frequency');

module.exports = {
  Query: {
    user: (_, { id }) => getUser(id),
  },
  User: {
    communityConnections: user => ({
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
    frequencyConnections: user => ({
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
