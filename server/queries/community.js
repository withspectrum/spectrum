/**
 * Community query resolvers
 */
const { getCommunity } = require('../models/community');
const { getFrequenciesByCommunity } = require('../models/frequency');
const { getUsers } = require('../models/user');

module.exports = {
  Query: {
    community: (_, { id }) => getCommunity(id),
  },
  Community: {
    frequencyConnections: ({ id }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getFrequenciesByCommunity(id).then(frequencies =>
        frequencies.map(frequency => ({
          node: frequency,
        }))
      ),
    }),
    memberConnections: ({ members }) => ({
      pageInfo: {
        hasNextPage: false,
      },
      edges: getUsers(members).then(users =>
        users.map(user => ({
          node: user,
        }))
      ),
    }),
  },
};
