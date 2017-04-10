const communities = [
  {
    id: 'spectrum-staging',
    createdAt: new Date(),
    name: 'Spectrum Staging',
    slug: 'spectrum',
    frequencies: ['general-123asdf'],
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
    stories: ['first-story-asdf123', 'second-story-asddf123'],
  },
];

const stories = [
  {
    id: 'first-story-asdf123',
    frequency: 'general-123asdf',
    createdAt: new Date(),
    last_activity: new Date(),
    published: true,
    content: {
      title: 'First story!',
      description: 'Welcome to RethinkDB.',
    },
  },
  {
    id: 'second-story-asddf123',
    frequency: 'general-123asdf',
    createdAt: new Date(),
    last_activity: new Date(),
    published: true,
    content: {
      title: 'Second story!',
      description: 'Getting full in here...',
    },
  },
];

const messages = [
  {
    id: 'first-message-asdf123',
    timestamp: new Date(),
    story: 'first-story-asdf123',
    message: {
      type: 'text',
      content: 'This is the first message!',
    },
  },
  {
    id: 'second-message-asdf123',
    timestamp: new Date(),
    story: 'first-story-asdf123',
    message: {
      type: 'text',
      content: 'This is the second message!',
    },
  },
  {
    id: 'first-message-asdf123',
    timestamp: new Date(),
    story: 'second-story-asddf123',
    message: {
      type: 'text',
      content: 'This is the first message in this story!',
    },
  },
];

module.exports = {
  communities,
  frequencies,
  stories,
  messages,
};
