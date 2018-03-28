// @flow
import reaction from './reaction';
import user from './user';
import message from './message';

module.exports = {
  Query: {
    reaction,
  },
  Reaction: {
    user,
    message,
  },
};
