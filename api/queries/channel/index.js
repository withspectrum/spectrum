// @flow
import channel from './rootChannel';

import memberCount from './memberCount';
import threadConnection from './threadConnection';
import community from './community';
import channelPermissions from './channelPermissions';
import communityPermissions from './communityPermissions';
import memberConnection from './memberConnection';
import metaData from './metaData';
import pendingUsers from './pendingUsers';
import blockedUsers from './blockedUsers';
import moderators from './moderators';
import owners from './owners';
import isArchived from './isArchived';
import joinSettings from './joinSettings';
import slackSettings from './slackSettings';

module.exports = {
  Query: {
    channel,
  },
  Channel: {
    memberCount,
    threadConnection,
    community,
    channelPermissions,
    communityPermissions,
    memberConnection,
    metaData,
    pendingUsers,
    blockedUsers,
    moderators,
    owners,
    isArchived,
    joinSettings,
    slackSettings,
  },
};
