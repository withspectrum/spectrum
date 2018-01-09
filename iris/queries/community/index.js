// @flow

// root resolvers
import rootCommunity from './rootCommunity';
import rootCommunities from './rootCommunities';
import rootTopCommunities from './rootTopCommunities';
import rootRecentCommunities from './rootRecentCommunities';
import rootSearchCommunities from './rootSearchCommunities';
import rootSearchCommunityThreads from './rootSearchCommunityThreads';

// community resolvers
import communityPermissions from './communityPermissions';
import channelConnection from './channelConnection';
import memberConnection from './memberConnection';
import pinnedThread from './pinnedThread';
import threadConnection from './threadConnection';
import metaData from './metaData';
import slackImport from './slackImport';
import invoices from './invoices';
import recurringPayments from './recurringPayments';
import memberGrowth from './memberGrowth';
import conversationGrowth from './conversationGrowth';
import topMembers from './topMembers';
import topAndNewThreads from './topAndNewThreads';
import isPro from './isPro';
import contextPermissions from './contextPermissions';
import watercooler from './watercooler';

module.exports = {
  Query: {
    community: rootCommunity,
    communities: rootCommunities,
    topCommunities: rootTopCommunities,
    recentCommunities: rootRecentCommunities,
    searchCommunities: rootSearchCommunities,
    searchCommunityThreads: rootSearchCommunityThreads,
  },
  Community: {
    communityPermissions: communityPermissions,
    channelConnection: channelConnection,
    memberConnection: memberConnection,
    pinnedThread: pinnedThread,
    threadConnection: threadConnection,
    metaData: metaData,
    slackImport: slackImport,
    invoices: invoices,
    recurringPayments: recurringPayments,
    memberGrowth: memberGrowth,
    conversationGrowth: conversationGrowth,
    topMembers: topMembers,
    topAndNewThreads: topAndNewThreads,
    isPro: isPro,
    contextPermissions: contextPermissions,
    watercooler: watercooler,
  },
};
