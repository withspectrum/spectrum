// @flow
import isAdmin from './isAdmin';
import coreMetrics from './coreMetrics';
import usersGrowth from './usersGrowth';
import communitiesGrowth from './communitiesGrowth';
import channelsGrowth from './channelsGrowth';
import threadsGrowth from './threadsGrowth';
import directMessageThreadsGrowth from './directMessageThreadsGrowth';
import threadMessagesGrowth from './threadMessagesGrowth';
import directMessagesGrowth from './directMessagesGrowth';
import topThreads from './topThreads';

module.exports = {
  Query: {
    meta: () => ({}),
  },
  Meta: {
    isAdmin,
    coreMetrics,
    usersGrowth,
    communitiesGrowth,
    channelsGrowth,
    threadsGrowth,
    directMessageThreadsGrowth,
    threadMessagesGrowth,
    directMessagesGrowth,
    topThreads,
  },
};
