// @flow
import channel from './rootChannel';

import memberCount from './memberCount';
import threadConnection from './threadConnection';
import community from './community';
import channelPermissions from './channelPermissions';
import communityPermissions from './communityPermissions';
import memberConnection from './memberConnection';
import metaData from './metaData';
import moderators from './moderators';
import owners from './owners';
import isArchived from './isArchived';
import joinSettings from './joinSettings';

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
    moderators,
    owners,
    isArchived,
    joinSettings,
  },
};
