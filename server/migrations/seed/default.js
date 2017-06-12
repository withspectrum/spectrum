const faker = require('faker');

// 2017/01/01
const DATE = 1483225200000;

const DEFAULT_USERS = [
  {
    id: 'gVk5mYwccUOEKiN5vtOouqroGKo1',
    name: 'Max Stoiber',
    description: 'Makes styled-components, react-boilerplate and micro-analytics 💅 Speciality coffee geek, skier, traveller ☕',
    website: 'https://mxstbr.com',
    username: 'mxstbr',
    profilePhoto: 'https://img.gs/jztmrqvgzv/500/mxstbr.com/headshot.jpeg',
    coverPhoto: 'https://pbs.twimg.com/profile_banners/2451223458/1479507323/1500x500',
    email: 'hi@mxstbr.com',
    subscriptions: [],
    providerId: '2451223458',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    name: 'Brian Lovin',
    description: 'Chief Nice Boy™',
    website: 'https://brianlovin.com',
    username: 'brian',
    profilePhoto: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
    coverPhoto: 'https://pbs.twimg.com/profile_banners/465068802/1490051733/1500x500',
    email: 'briandlovin@gmail.com',
    subscriptions: [],
    providerId: '465068802',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: 'VToKcde16dREgDkXcDl3hhcrFN33',
    name: 'Bryn Jackson',
    description: 'full-stack flapjack',
    website: 'https://bryn.io',
    username: 'bryn',
    profilePhoto: 'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto: 'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@bryn.io',
    subscriptions: [],
    providerId: '17106008',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
];

const DEFAULT_COMMUNITIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(DATE),
    name: 'Spectrum',
    description: 'The future of communities',
    website: 'https://spectrum.chat',
    profilePhoto: faker.image.business(),
    coverPhoto: faker.image.image(),
    slug: 'spectrum',
  },
];

const DEFAULT_CHANNELS = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(DATE),
    name: 'General',
    description: 'General chatter',
    slug: 'general',
    isPrivate: false,
    isDefault: true,
  },
];

const DEFAULT_THREADS = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    createdAt: new Date(DATE),
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
        timestamp: new Date(DATE),
        content: {
          title: 'The first thread! 🎉',
          body: 'This is it, we got a thread here',
        },
      },
    ],
    modifiedAt: new Date(DATE),
  },
];

const DEFAULT_DIRECT_MESSAGE_THREADS = [
  {
    id: 'first-dm-thread-asfd123',
    createdAt: new Date(DATE),
    name: null,
    threadLastActive: new Date(),
  },
];

const DEFAULT_USERS_DIRECT_MESSAGE_THREADS = [
  {
    createdAt: new Date(DATE),
    userId: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
];

const DEFAULT_USERS_COMMUNITIES = [
  {
    createdAt: new Date(DATE),
    userId: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
  },
];

const DEFAULT_USERS_CHANNELS = [
  {
    createdAt: new Date(DATE),
    userId: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    isPending: false,
    receiveNotifications: true,
  },
];

module.exports = {
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_CHANNELS,
  DEFAULT_THREADS,
  DEFAULT_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_COMMUNITIES,
  DEFAULT_USERS_CHANNELS,
};
