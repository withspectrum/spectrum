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
    communities: user => getCommunitiesByUser(user.uid),
    frequencies: user => getFrequenciesByUser(user.uid),
  },
};
