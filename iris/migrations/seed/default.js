const { fromPlainText, toJSON } = require('../../../shared/draft-utils');

// 2017/01/01
const DATE = 1483225200000;

const MAX_ID = 'gVk5mYwccUOEKiN5vtOouqroGKo1';
const BRIAN_ID = '01p2A7kDCWUjGj6zQLlMQUOSQL42';
const BRYN_ID = 'VToKcde16dREgDkXcDl3hhcrFN33';

const DEFAULT_USERS = [
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
    subscriptions: [],
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
    subscriptions: [],
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
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
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
    creatorId: BRIAN_ID,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'The first thread! 🎉',
      body: JSON.stringify(
        toJSON(fromPlainText('This is it, we got a thread here'))
      ),
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE),
        content: {
          title: 'The first thread! 🎉',
          body: JSON.stringify(
            toJSON(fromPlainText('This is it, we got a thread here'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE),
    lastActive: new Date(DATE),
  },
  {
    id: '11e736b3-5464-4bab-acfd-bbd42cddc1dd',
    createdAt: new Date(DATE + 1),
    creatorId: MAX_ID,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 1),
        content: {
          title: 'Another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 1),
    lastActive: new Date(DATE + 1),
  },
  {
    id: 'f2eb9d3d-ed05-49ae-8fc9-91d02314d5a9',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
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
    userId: '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
];

const DEFAULT_USERS_COMMUNITIES = [
  {
    createdAt: new Date(DATE),
    userId: MAX_ID,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100,
  },
  {
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: false,
    isModerator: true,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 101,
  },
  {
    createdAt: new Date(DATE),
    userId: BRYN_ID,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 102,
  },
];

const DEFAULT_USERS_CHANNELS = [
  {
    createdAt: new Date(DATE),
    userId: '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    isPending: false,
    receiveNotifications: true,
  },
];

const DEFAULT_MESSAGES = [
  {
    id: '0063e9e6-8960-4dd4-96ab-f18bca4cf75f',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('This is the first message!'))),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE),
  },
  {
    id: '46814c43-9011-4f88-8ba0-94d52c316e71',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('This is the second message!'))
      ),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 1),
  },
  {
    id: 'e0392713-adbb-461a-bcb6-f81d0e6c21f8',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('The next one is an emoji-only one :scream:'))
      ),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 2),
  },
  {
    id: '78ce5bb4-3015-4eb9-ad4e-3e921883ceb3',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('🎉'))),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 3),
  },
];

const DEFAULT_NOTIFICATIONS = [];

module.exports = {
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_CHANNELS,
  DEFAULT_THREADS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_COMMUNITIES,
  DEFAULT_USERS_CHANNELS,
  DEFAULT_MESSAGES,
};
