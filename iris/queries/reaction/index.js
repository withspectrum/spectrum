// @flow
import reaction from './reaction';
import users from './users';
import message from './message';

module.exports = {
  Query: {
    reaction,
  },
  Reaction: {
    users,
    message,
  },
};
