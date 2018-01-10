// @flow
import UserError from '../utils/UserError';
import { isAdmin } from '../utils/permissions';
import { saveUserCommunityPermissions } from '../models/meta';

import saveUserCommunityPermissions from './saveUserCommunityPermissions';

module.exports = {
  Mutation: {
    saveUserCommunityPermissions,
  },
};
