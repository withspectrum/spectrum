// @flow
const constants = require('./constants');
const {
  DATE,
  SPECTRUM_COMMUNITY_ID,
  PAYMENTS_COMMUNITY_ID,
  DELETED_COMMUNITY_ID,
  PRIVATE_COMMUNITY_ID,
  SPECTRUM_GENERAL_CHANNEL_ID,
  SPECTRUM_PRIVATE_CHANNEL_ID,
  PAYMENTS_GENERAL_CHANNEL_ID,
  PAYMENTS_PRIVATE_CHANNEL_ID,
  SPECTRUM_ARCHIVED_CHANNEL_ID,
  SPECTRUM_DELETED_CHANNEL_ID,
  DELETED_COMMUNITY_DELETED_CHANNEL_ID,
  MODERATOR_CREATED_CHANNEL_ID,
  PRIVATE_GENERAL_CHANNEL_ID,
} = constants;

module.exports = [
  {
    id: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'General',
    description: 'General chatter',
    slug: 'general',
    isPrivate: false,
    isDefault: true,
  },

  {
    id: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Private',
    description: 'Private chatter',
    slug: 'private',
    isPrivate: true,
    isDefault: false,
  },

  {
    id: PAYMENTS_GENERAL_CHANNEL_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'General',
    description: 'General chatter',
    slug: 'general',
    isPrivate: false,
    isDefault: true,
  },

  {
    id: PAYMENTS_PRIVATE_CHANNEL_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Private',
    description: 'Private chatter',
    slug: 'private',
    isPrivate: true,
    isDefault: false,
  },

  {
    id: SPECTRUM_ARCHIVED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Archived',
    description: 'Testing archiving',
    slug: 'archived',
    isPrivate: false,
    isDefault: true,
    archivedAt: new Date(DATE),
  },

  {
    id: SPECTRUM_DELETED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Deleted',
    description: 'Testing deleted channel',
    slug: 'deleted',
    isPrivate: false,
    isDefault: false,
    deletedAt: new Date(DATE),
  },

  {
    id: DELETED_COMMUNITY_DELETED_CHANNEL_ID,
    communityId: DELETED_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Deleted',
    description: 'Testing deleted channel',
    slug: 'deleted',
    isPrivate: false,
    isDefault: false,
    deletedAt: new Date(DATE),
  },

  {
    id: MODERATOR_CREATED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Moderator created',
    description: 'Moderator created channel',
    slug: 'moderator-created',
    isPrivate: false,
    isDefault: false,
  },

  {
    id: PRIVATE_GENERAL_CHANNEL_ID,
    communityId: PRIVATE_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'General',
    description: 'General',
    slug: 'private-general',
    isPrivate: false,
    isDefault: false,
  },
];
