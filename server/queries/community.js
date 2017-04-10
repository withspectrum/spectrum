/**
 * Community query resolvers
 */
const { getCommunity } = require('../models/community');
const { getFrequenciesByCommunity } = require('../models/frequency');

module.exports = {
  Query: {
    community: (_, { id }) => getCommunity(id),
  },
  Community: {
    frequencies: ({ id }) => getFrequenciesByCommunity(id),
  },
};
