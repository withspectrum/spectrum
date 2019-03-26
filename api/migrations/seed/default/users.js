// @flow
const constants = require('./constants');
const {
  MAX_ID,
  BRIAN_ID,
  BRYN_ID,
  QUIET_USER_ID,
  BLOCKED_USER_ID,
  PREVIOUS_MEMBER_USER_ID,
  CHANNEL_MODERATOR_USER_ID,
  COMMUNITY_MODERATOR_USER_ID,
  SINGLE_CHANNEL_COMMUNITY_USER_ID,
  NEW_USER_ID,
  DATE,
} = constants;

module.exports = [
  {
    id: MAX_ID,
    name: 'Max Stoiber',
    description:
      'Makes styled-components, react-boilerplate and micro-analytics 💅 Speciality coffee geek, skier, traveller ☕',
    website: 'https://mxstbr.com',
    username: 'mxstbr',
    profilePhoto: 'https://img.gs/jztmrqvgzv/500/mxstbr.com/headshot.jpeg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/2451223458/1479507323/1500x500',
    email: 'contact@mxstbr.com',
    providerId: '2451223458',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: BRIAN_ID,
    name: 'Brian Lovin',
    description: 'Chief Nice Boy™',
    website: 'https://brianlovin.com',
    username: 'brian',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/465068802/1490051733/1500x500',
    email: 'briandlovin@gmail.com',
    providerId: '465068802',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: BRYN_ID,
    name: 'Bryn Jackson',
    description: 'full-stack flapjack',
    website: 'https://bryn.io',
    username: 'bryn',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@bryn.io',
    providerId: '17106008',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: QUIET_USER_ID,
    name: 'Quiet user',
    description: "I've never joined anything on Spectrum",
    website: '',
    username: 'quiet-user',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@quietuser.com',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: BLOCKED_USER_ID,
    name: 'Blocked user',
    description: 'I am blocked in the Spectrum community',
    website: '',
    username: 'blocked-user',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@blockeduser.com',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: PREVIOUS_MEMBER_USER_ID,
    name: 'Previous member',
    description: 'I used to be in the Spectrum community, but then left',
    website: '',
    username: 'previous-user',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@previousboy.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: CHANNEL_MODERATOR_USER_ID,
    name: 'Channel moderator',
    description: 'I moderate all channels',
    website: '',
    username: 'channel-moderator-user',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@channelmoderatorboy.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: COMMUNITY_MODERATOR_USER_ID,
    name: 'Community moderator',
    description: 'I moderate all communities',
    website: '',
    username: 'community-moderator-user',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@communitymoderatorboy.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: SINGLE_CHANNEL_COMMUNITY_USER_ID,
    name: 'Single community person',
    description: 'Im a member of one community',
    website: '',
    username: 'single-community-user',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@singlecommunity.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: NEW_USER_ID,
    name: 'New user',
    description: 'Just joined spectrum',
    website: '',
    username: null,
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@newuser.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
];
