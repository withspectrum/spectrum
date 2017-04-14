/**
 * Direct Message Group mutation resolvers
 */
const { addDirectMessageGroup } = require('../models/directMessageGroup');

module.exports = {
  Mutation: {
    addDirectMessageGroup: (_, directMessageGroup) =>
      addDirectMessageGroup(directMessageGroup),
  },
};
