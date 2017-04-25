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
];

const DEFAULT_COMMUNITIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
    createdAt: new Date(),
    name: 'Spectrum',
    slug: 'spectrum',
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
    subscribers: [DEFAULT_USERS.map(({ uid }) => uid)],
  },
];

const DEFAULT_STORIES = [
  {
    id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
    createdAt: new Date(),
    author: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a190',
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

module.exports = {
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_FREQUENCIES,
  DEFAULT_STORIES,
};
