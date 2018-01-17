// @flow
import user from './rootUser';
import currentUser from './rootCurrentUser';
import searchUsers from './rootSearchUsers';

import email from './email';
import coverPhoto from './coverPhoto';
import profilePhoto from './profilePhoto';
import isPro from './isPro';
import everything from './everything';
import communityConnection from './communityConnection';
import channelConnection from './channelConnection';
import directMessageThreadsConnection from './directMessageThreadsConnection';
import threadConnection from './threadConnection';
import threadCount from './threadCount';
import recurringPayments from './recurringPayments';
import settings from './settings';
import invoices from './invoices';
import totalReputation from './totalReputation';
import isAdmin from './isAdmin';
import contextPermissions from './contextPermissions';

module.exports = {
  Query: {
    user,
    currentUser,
    searchUsers,
  },
  User: {
    email,
    coverPhoto,
    profilePhoto,
    isPro,
    everything,
    communityConnection,
    channelConnection,
    directMessageThreadsConnection,
    threadConnection,
    threadCount,
    recurringPayments,
    settings,
    invoices,
    totalReputation,
    isAdmin,
    contextPermissions,
  },
};
