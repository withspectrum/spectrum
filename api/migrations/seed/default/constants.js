// @flow
const DATE = 1483225200000;

// users
const MAX_ID = '1';
const BRIAN_ID = '2';
const BRYN_ID = '3';
// this user is blocked in spectrum community
const BLOCKED_USER_ID = '4';
// this user is has never joined communities or channels
const QUIET_USER_ID = '5';
// this user was a previous member of spectrum community
const PREVIOUS_MEMBER_USER_ID = '6';
// this user is pending in all private channels
const PENDING_USER_ID = '7';
// this user is moderator in all channels, member in all communities
const CHANNEL_MODERATOR_USER_ID = '8';
// this user is moderator in all communities
const COMMUNITY_MODERATOR_USER_ID = '9';

// communities
const SPECTRUM_COMMUNITY_ID = '1';
const PAYMENTS_COMMUNITY_ID = '2';
const DELETED_COMMUNITY_ID = '3';
const PRIVATE_COMMUNITY_ID = '4';

// channels
const SPECTRUM_GENERAL_CHANNEL_ID = '1';
const SPECTRUM_PRIVATE_CHANNEL_ID = '2';
const PAYMENTS_GENERAL_CHANNEL_ID = '3';
const PAYMENTS_PRIVATE_CHANNEL_ID = '4';
const SPECTRUM_ARCHIVED_CHANNEL_ID = '5';
const SPECTRUM_DELETED_CHANNEL_ID = '6';
const DELETED_COMMUNITY_DELETED_CHANNEL_ID = '7';
const MODERATOR_CREATED_CHANNEL_ID = '8';
const PRIVATE_GENERAL_CHANNEL_ID = '9';

module.exports = {
  DATE,
  MAX_ID,
  BRIAN_ID,
  BRYN_ID,
  BLOCKED_USER_ID,
  QUIET_USER_ID,
  PREVIOUS_MEMBER_USER_ID,
  PENDING_USER_ID,
  CHANNEL_MODERATOR_USER_ID,
  COMMUNITY_MODERATOR_USER_ID,
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
};
