// @flow
const { db } = require('./db');
import { getUserById } from '../models/user';

/*
===========================================================

        MODIFYING AND CREATING DATA IN USERSCOMMUNITIES

===========================================================
*/

// invoked only when a new community is being created. the user who is doing
// the creation is automatically an owner and a member
const saveUserCommunityPermissions = (
  permissions: any,
  userId: string,
  communityId: string
): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .filter({ communityId })
    .update(
      {
        ...permissions,
      },
      { returnChanges: true }
    )
    .run()
    .then(() => getUserById(userId));
};

module.exports = {
  saveUserCommunityPermissions,
};
