const faker = require('faker');

const DEFAULT_USERS = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
    name: 'Max Stoiber',
    description: 'Makes styled-components, react-boilerplate and micro-analytics 💅 Speciality coffee geek, skier, traveller ☕',
    website: 'https://mxstbr.com',
    username: 'mxstbr',
    profilePhoto: 'https://img.gs/jztmrqvgzv/500/mxstbr.com/headshot.jpeg',
    coverPhoto: 'https://pbs.twimg.com/profile_banners/2451223458/1479507323/1500x500',
    email: 'hi@mxstbr.com',
    subscriptions: [],
    providerId: '2451223458',
    createdAt: new Date(),
    lastSeen: new Date(),
  },
  {
    id: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    name: 'Brian Lovin',
    description: 'Chief Nice Boy™',
    website: 'https://brianlovin.com',
    username: 'brian',
    profilePhoto: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
    coverPhoto: 'https://pbs.twimg.com/profile_banners/465068802/1490051733/1500x500',
    email: 'briandlovin@gmail.com',
    subscriptions: [],
    providerId: '465068802',
    createdAt: new Date(),
    lastSeen: new Date(),
  },
  {
    id: 'uItS3QQiUxXH44m14uWmixTbqSc2',
    name: 'Bryn Jackson',
    description: 'full-stack flapjack',
    website: 'https://bryn.io',
    username: 'bryn',
    profilePhoto: 'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto: 'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@bryn.io',
    subscriptions: [],
    providerId: '17106008',
    createdAt: new Date(),
    lastSeen: new Date(),
  },
];

// SCHEMA:TODO
// Subscription Model

const DEFAULT_COMMUNITIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(),
    name: 'Spectrum',
    description: 'The future of communities',
    website: 'https://spectrum.chat',
    profilePhoto: faker.image.business(),
    coverPhoto: faker.image.image(),
    slug: 'spectrum',
    members: DEFAULT_USERS.map(({ id }) => id),
    owners: DEFAULT_USERS.map(({ id }) => id),
    moderators: [],
    blockedUsers: [],
  },
];

const DEFAULT_CHANNELS = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(),
    name: 'General',
    description: 'General chatter',
    slug: 'general',
    isPrivate: false,
    members: DEFAULT_USERS.map(({ id }) => id),
    owners: DEFAULT_USERS.map(({ id }) => id),
    moderators: [],
    pendingUsers: [],
    blockedUsers: [],
  },
];

const DEFAULT_THREADS = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    createdAt: new Date(),
    creatorId: 'uItS3QQiUxXH44m14uWmixTbqSc2',
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    content: {
      title: 'The first thread! 🎉',
      body: 'This is it, we got a thread here',
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(),
        content: {
          title: 'The first thread! 🎉',
          body: 'This is it, we got a thread here',
        },
      },
    ],
    modifiedAt: new Date(),
  },
];

// SCHEMA:TODO
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'first-notification-asfd123',
    createdAt: new Date(),
    users: [
      {
        id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
        read: false,
      },
      {
        id: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
        read: false,
      },
    ],
    type: 'NEW_THREAD',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    sender: 'uItS3QQiUxXH44m14uWmixTbqSc2',
    content: {
      title: 'The first thread! 🎉',
      excerpt: 'This is it, we got a thread here',
    },
  },
];

const DEFAULT_DIRECT_MESSAGE_THREADS = [
  {
    id: 'first-dm-thread-asfd123',
    creatorId: DEFAULT_USERS[0].id,
    createdAt: new Date(),
    name: null,
    lastActivity: new Date(),
    participants: DEFAULT_USERS.map(user => user.id),
    status: DEFAULT_USERS.map(user => {
      return {
        userId: user.id,
        lastActivity: new Date(),
        lastSeen: new Date(),
      };
    }),
  },
];

module.exports = {
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_CHANNELS,
  DEFAULT_THREADS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_DIRECT_MESSAGE_THREADS,
};
