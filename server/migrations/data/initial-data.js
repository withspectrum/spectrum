const communities = [
  {
    id: 'spectrum-staging',
    createdAt: new Date(),
    name: 'Spectrum Staging',
    slug: 'spectrum',
    members: ['58a023a4-912d-48fe-a61c-eec7274f7699'],
  },
];

const frequencies = [
  {
    id: 'general-123asdf',
    community: 'spectrum-staging',
    createdAt: new Date(),
    modifiedAt: new Date(),
    name: 'General',
    description: "Let's get a frequency in here!",
    slug: 'general',
    subscribers: ['58a023a4-912d-48fe-a61c-eec7274f7699'],
  },
];

const stories = [
  {
    id: 'first-story-asdf123',
    frequency: 'general-123asdf',
    createdAt: new Date(),
    modifiedAt: new Date(),
    published: true,
    content: {
      title: 'First story!',
      description: 'Welcome to RethinkDB.',
    },
    edits: [
      {
        timestamp: new Date(),
        content: {
          title: 'First story!',
          description: 'Welcome to RethinkDB.',
        },
      },
    ],
    author: '58a023a4-912d-48fe-a61c-eec7274f7699',
  },
  {
    id: 'second-story-asddf123',
    frequency: 'general-123asdf',
    createdAt: new Date(),
    modifiedAt: new Date(),
    published: true,
    content: {
      title: 'Second story!',
      description: 'Getting full in here...',
    },
    edits: [
      {
        timestamp: new Date(),
        content: {
          title: 'Second story!',
          description: 'Getting full in here...',
        },
      },
    ],
    author: '58a023a4-912d-48fe-a61c-eec7274f7699',
  },
];

const messages = [
  {
    id: 'first-message-asdf123',
    timestamp: new Date(),
    thread: 'first-story-asdf123',
    message: {
      type: 'text',
      content: 'This is the first message!',
    },
    sender: '58a023a4-912d-48fe-a61c-eec7274f7699',
  },
  {
    id: 'second-message-asdf123',
    timestamp: new Date(),
    thread: 'first-story-asdf123',
    message: {
      type: 'text',
      content: 'This is the second message!',
    },
    sender: '58a023a4-912d-48fe-a61c-eec7274f7699',
  },
  {
    id: 'first-message-asdf123',
    timestamp: new Date(),
    thread: 'second-story-asddf123',
    message: {
      type: 'text',
      content: 'This is the first message in this story!',
    },
    sender: '58a023a4-912d-48fe-a61c-eec7274f7699',
  },
];

const users = [
  {
    createdAt: new Date(),
    displayName: 'Max Stoiber',
    email: null,
    lastSeen: new Date(),
    photoURL: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_normal.jpg',
    providerId: '2451223458',
    uid: '58a023a4-912d-48fe-a61c-eec7274f7699',
    username: 'mxstbr',
  },
  {
    createdAt: new Date(),
    displayName: 'Brian Lovin',
    email: null,
    lastSeen: new Date(),
    photoURL: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_normal.jpg',
    providerId: '2451223458',
    uid: '58a023a4-912d-48fe-a61c-eec7274f7698',
    username: 'brian',
  },
];

const directMessages = [
  {
    id: 'first-direct-message-asdf123',
    timestamp: new Date(),
    thread: 'first-message-group-asdf123',
    message: {
      type: 'text',
      content: 'This is the first message in this direct message group!',
    },
    sender: '58a023a4-912d-48fe-a61c-eec7274f7699',
  },
];

const directMessageGroups = [
  {
    id: 'first-message-group-asdf123',
    creator: '58a023a4-912d-48fe-a61c-eec7274f7699',
    lastActivity: new Date(),
    users: [
      {
        user: '58a023a4-912d-48fe-a61c-eec7274f7699',
        lastActivity: new Date(),
        lastSeen: new Date(),
      },
      {
        user: '58a023a4-912d-48fe-a61c-eec7274f7698',
        lastActivity: new Date(),
        lastSeen: new Date(),
      },
    ],
  },
];

module.exports = {
  communities,
  frequencies,
  stories,
  messages,
  users,
  directMessages,
  directMessageGroups,
};
