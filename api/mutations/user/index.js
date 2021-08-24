// @flow
import editUser from './editUser';
import deleteCurrentUser from './deleteCurrentUser';
import banUser from './banUser';

module.exports = {
  Mutation: {
    editUser,
    deleteCurrentUser,
    banUser,
  },
};
