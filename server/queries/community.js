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
    frequencies: ({ id }) => getFrequenciesByCommunity(id),
    members: ({ members }) => getUsers(members),
  },
};
