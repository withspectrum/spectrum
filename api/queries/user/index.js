// @flow
import user from './rootUser';
import currentUser from './rootCurrentUser';
import searchUsers from './rootSearchUsers';

import email from './email';
import coverPhoto from './coverPhoto';
import profilePhoto from './profilePhoto';
import everything from './everything';
import communityConnection from './communityConnection';
import channelConnection from './channelConnection';
import directMessageThreadsConnection from './directMessageThreadsConnection';
import threadConnection from './threadConnection';
import threadCount from './threadCount';
import settings from './settings';
import totalReputation from './totalReputation';
import isAdmin from './isAdmin';
import contextPermissions from './contextPermissions';
import githubProfile from './githubProfile';
import isOnline from './isOnline';

// no-op resolvers to transition while removing payments
import type { DBUser } from 'shared/types';
const isPro = (dbUser: DBUser) => dbUser.betaSupporter;
const recurringPayments = () => [];
const invoices = () => [];

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
    everything,
    communityConnection,
    channelConnection,
    directMessageThreadsConnection,
    threadConnection,
    threadCount,
    settings,
    totalReputation,
    isAdmin,
    githubProfile,
    contextPermissions,
    isPro,
    recurringPayments,
    invoices,
    isOnline,
  },
};
