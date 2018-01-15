const { fromPlainText, toJSON } = require('../../../shared/draft-utils');

// 2017 / 01 / 01;
const DATE = 1483225200000;

const MAX_ID = 'gVk5mYwccUOEKiN5vtOouqroGKo1';
const BRIAN_ID = '01p2A7kDCWUjGj6zQLlMQUOSQL42';
const BRYN_ID = 'VToKcde16dREgDkXcDl3hhcrFN33';
const NO_PERMISSIONS_USER = 'e16dREgWUjGj6iN5vtOo';
const BLOCKED_USER = 'kDCWUjGjDkXcDl3hhcrFNgWUjGj6iN5';

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
  {
    id: NO_PERMISSIONS_USER,
    name: 'Bad Boy',
    description: "I can't do shit on this website",
    website: '',
    username: 'bad-boy',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@badboy.io',
    subscriptions: [],
    providerId: '171060089',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE),
  },
  {
    id: BLOCKED_USER,
    name: 'Blocked user',
    description: 'I am blocked in the Spectrum community',
    website: '',
    username: 'blocked-boy',
    profilePhoto:
      'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    coverPhoto:
      'https://pbs.twimg.com/profile_banners/17106008/1491444958/1500x500',
    email: 'hi@blockedboy.io',
    subscriptions: [],
    providerId: '171060090',
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

const DEFAULT_USERS_THREADS = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    createdAt: new Date(DATE),
    userId: MAX_ID,
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '11e736b3-5464-4bab-acfd-bbd42cddc1dd',
    createdAt: new Date(DATE + 1),
    userId: MAX_ID,
    threadId: '11e736b3-5464-4bab-acfd-bbd42cddc1dd',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: 'f2eb9d3d-ed05-49ae-8fc9-91d02314d5a9',
    createdAt: new Date(DATE + 2),
    userId: MAX_ID,
    threadId: 'f2eb9d3d-ed05-49ae-8fc9-91d02314d5a9',
    receiveNotifications: true,
    isParticipant: true,
  },
];

const DEFAULT_DIRECT_MESSAGE_THREADS = [
  {
    id: 'first-dm-thread-asdf123',
    createdAt: new Date(DATE),
    name: null,
    threadLastActive: new Date(DATE),
  },
];

const DEFAULT_USERS_DIRECT_MESSAGE_THREADS = [
  {
    id: '1f462515-e1e7-4aff-be48-adda326df133',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    threadId: 'first-dm-thread-asdf123',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
  {
    createdAt: new Date(DATE),
    userId: BRYN_ID,
    threadId: 'first-dm-thread-asdf123',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
  {
    createdAt: new Date(DATE),
    userId: MAX_ID,
    threadId: 'first-dm-thread-asdf123',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
];

const DEFAULT_USERS_COMMUNITIES = [
  {
    id: '6a942fe5-ee63-478d-afd6-ff19ad2d4677',
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
    id: '12803353-cb86-4109-8c4a-9abba79398d8',
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
    id: '80b16afe-8576-4970-99ab-240b1a975b99',
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
  {
    id: '80b16afe-8576-4970-99ab-240b1a975b100',
    createdAt: new Date(DATE),
    userId: BLOCKED_USER,
    communityId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    isOwner: false,
    isModerator: false,
    isMember: false,
    isBlocked: true,
    receiveNotifications: false,
    reputation: 102,
  },
];

const DEFAULT_USERS_CHANNELS = [
  {
    id: '11fa5e3e-930d-4ba9-a1d4-0664ad451012',
    createdAt: new Date(DATE),
    userId: MAX_ID,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    isPending: false,
    receiveNotifications: true,
  },
  {
    id: '2511be41-9d36-462f-bedc-3eecc62759e3',
    createdAt: new Date(DATE),
    userId: BRYN_ID,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
  },
  {
    id: '7411906b-54a0-4c18-b26c-2522ad59c7f9',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    isOwner: false,
    isModerator: true,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
  },
  {
    id: '7411906b-54a0-4c18-b26c-2522ad59c7f9',
    createdAt: new Date(DATE),
    userId: BLOCKED_USER,
    channelId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    isOwner: false,
    isModerator: false,
    isMember: false,
    isBlocked: true,
    receiveNotifications: false,
  },
];

const DEFAULT_MESSAGES = [
  {
    id: '0063e9e6-8960-4dd4-96ab-f18bca4cf75f',
    threadId: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    attachments: [],
    content: {
      body: JSON.stringify({
        blocks: [
          {
            key: '9u8bg',
            text: 'This is the first message!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      }),
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
  // DM Thread
  {
    threadId: 'first-dm-thread-asdf123',
    threadType: 'directMessageThread',
    id: 'b546f27e-d842-4afe-900d-ad26ee60ca03',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('Direct message thread message!'))
      ),
    },
    messageType: 'draftjs',
    senderId: MAX_ID,
    timestamp: new Date(DATE),
  },
  {
    threadId: 'first-dm-thread-asdf123',
    threadType: 'directMessageThread',
    id: '2017f510-fe85-4de2-b5b2-6324567a6871',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A second one'))),
    },
    messageType: 'draftjs',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 50000),
  },
  {
    threadId: 'first-dm-thread-asdf123',
    threadType: 'directMessageThread',
    id: '965830bb-e79d-4cec-acfa-91f67b590865',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A third one'))),
    },
    messageType: 'draftjs',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 100000),
  },
  {
    threadId: 'first-dm-thread-asdf123',
    threadType: 'directMessageThread',
    id: '77e9619d-bea2-443a-bb9c-4b2957980644',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A fourth one'))),
    },
    messageType: 'draftjs',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 200000),
  },
  {
    threadId: 'first-dm-thread-asdf123',
    threadType: 'directMessageThread',
    id: '9356f7f1-4be0-4230-8f79-71a9f97f7a1f',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A fifth one'))),
    },
    messageType: 'draftjs',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 300000),
  },
];

const DEFAULT_NOTIFICATIONS = [];

const DEFAULT_SESSIONS = [
  {
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // A year from now
    // NOTE(@mxstbr): I logged in locally and copy and pasted this value so it works in conjunction with the cookie value in tests. Don't change it.
    id: '18-Czh8IkWuq6o8LJ0OnDRXCYt7iBsQ_',
    session: {
      cookie: {
        _expires: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ), // A year from now
        httpOnly: true,
        originalMaxAge: 31556952000, // No idea what this is, taken from our db
        path: '/',
        secure: false,
      },
      passport: {
        user: MAX_ID,
      },
    },
  },
];

module.exports = {
  MAX_ID,
  BRIAN_ID,
  NO_PERMISSIONS_USER,
  BRYN_ID,
  BLOCKED_USER,
  DATE,
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_CHANNELS,
  DEFAULT_THREADS,
  DEFAULT_USERS_THREADS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_COMMUNITIES,
  DEFAULT_USERS_CHANNELS,
  DEFAULT_SESSIONS,
  DEFAULT_MESSAGES,
};
