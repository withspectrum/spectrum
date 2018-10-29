// @flow

import community from './rootCommunity';
import communities from './rootCommunities';
import topCommunities from './rootTopCommunities';
import recentCommunities from './rootRecentCommunities';
import searchCommunities from './rootSearchCommunities';
import searchCommunityThreads from './rootSearchCommunityThreads';

import communityPermissions from './communityPermissions';
import channelConnection from './channelConnection';
import memberConnection from './memberConnection';
import members from './members';
import pinnedThread from './pinnedThread';
import threadConnection from './threadConnection';
import metaData from './metaData';
import slackImport from './slackImport';
import memberGrowth from './memberGrowth';
import conversationGrowth from './conversationGrowth';
import topMembers from './topMembers';
import topAndNewThreads from './topAndNewThreads';
import contextPermissions from './contextPermissions';
import watercooler from './watercooler';
import brandedLogin from './brandedLogin';
import slackSettings from './slackSettings';
import joinSettings from './joinSettings';
import coverPhoto from './coverPhoto';
import profilePhoto from './profilePhoto';

// no-op resolvers to transition while removing payments
import type { DBCommunity } from 'shared/types';
const isPro = () => false;
const recurringPayments = () => [];
const invoices = () => [];
const billingSettings = (community: DBCommunity) => ({
  pendingAdministratorEmail: null,
  administratorEmail: community.administratorEmail,
  sources: [],
  invoices: [],
  subscriptions: [],
});
const hasChargeableSource = () => false;
const hasFeatures = () => ({ analytics: true, prioritySupport: true });

module.exports = {
  Query: {
    community,
    communities,
    topCommunities,
    recentCommunities,
    searchCommunities,
    searchCommunityThreads,
  },
  Community: {
    communityPermissions,
    channelConnection,
    memberConnection, // deprecated
    members,
    pinnedThread,
    threadConnection,
    metaData,
    slackImport,
    memberGrowth,
    conversationGrowth,
    topMembers,
    topAndNewThreads,
    contextPermissions,
    watercooler,
    brandedLogin,
    slackSettings,
    joinSettings,
    coverPhoto,
    profilePhoto,

    invoices,
    recurringPayments,
    isPro,
    billingSettings,
    hasChargeableSource,
    hasFeatures,
  },
};
