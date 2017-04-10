const { getMessage } = require('../model/message');

module.exports = {
  Query: {
    message: (_, { id }) => getMessage(id),
  },
};
