const DEFAULT_USERS = [
  {
    createdAt: new Date(),
    displayName: 'Max Stoiber',
    username: 'mxstbr',
    lastSeen: new Date(),
    photoURL: 'https://img.gs/jztmrqvgzv/500/mxstbr.com/headshot.jpeg',
    uid: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
    providerId: '2451223458',
  },
  {
    createdAt: new Date(),
    displayName: 'Brian Lovin',
    username: 'brian',
    lastSeen: new Date(),
    photoURL: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
    uid: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    providerId: '465068802',
  },
  {
    createdAt: new Date(),
    displayName: 'Bryn Jackson',
    username: 'bryn',
    lastSeen: new Date(),
    photoURL: 'https://pbs.twimg.com/profile_images/848823167699230721/-9CbPtto_bigger.jpg',
    uid: 'uItS3QQiUxXH44m14uWmixTbqSc2',
    providerId: '17106008',
  },
];

const DEFAULT_COMMUNITIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(),
    name: 'Spectrum',
    slug: 'spectrum',
    description: 'The future of community.',
    members: [DEFAULT_USERS.map(({ uid }) => uid)],
  },
];

const DEFAULT_FREQUENCIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    community: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(),
    modifiedAt: new Date(),
    name: 'General',
    description: 'General chatter',
    slug: 'general',
    subscribers: DEFAULT_USERS.map(({ uid }) => uid),
  },
];

const DEFAULT_STORIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    createdAt: new Date(),
    author: 'uItS3QQiUxXH44m14uWmixTbqSc2',
    frequency: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    modifiedAt: new Date(),
    published: true,
    content: {
      title: 'The first story! 🎉',
      description: 'This is it, we got a story here',
    },
    edits: [
      {
        timestamp: new Date(),
        content: {
          title: 'The first story! 🎉',
          description: 'This is it, we got a story here',
        },
      },
    ],
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'first-notification-asfd123',
    createdAt: new Date(),
    users: [
      {
        uid: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
        read: false,
      },
      {
        uid: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
        read: false,
      },
    ],
    type: 'NEW_STORY',
    story: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    frequency: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
    community: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    sender: 'uItS3QQiUxXH44m14uWmixTbqSc2',
    content: {
      title: 'The first story! 🎉',
      excerpt: 'This is it, we got a story here',
    },
  },
];

module.exports = {
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_FREQUENCIES,
  DEFAULT_STORIES,
  DEFAULT_NOTIFICATIONS,
};
