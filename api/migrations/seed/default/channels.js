// @flow
const constants = require('./constants');
const {
  DATE,
  SPECTRUM_COMMUNITY_ID,
  PAYMENTS_COMMUNITY_ID,
  SPECTRUM_GENERAL_CHANNEL_ID,
  SPECTRUM_PRIVATE_CHANNEL_ID,
  PAYMENTS_GENERAL_CHANNEL_ID,
  PAYMENTS_PRIVATE_CHANNEL_ID,
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
];
