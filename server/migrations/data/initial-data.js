const communities = [
  {
    id: 'spectrum-staging',
    createdAt: Date.now(),
    name: 'Spectrum Staging',
    slug: 'spectrum',
    frequencies: ['general-123asdf'],
  },
];

const frequencies = [
  {
    id: 'general-123asdf',
    community: 'spectrum-staging',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
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
    createdAt: Date.now(),
    last_activity: Date.now(),
    published: true,
    content: {
      title: 'First story!',
      description: 'Welcome to RethinkDB.',
    },
  },
  {
    id: 'second-story-asddf123',
    frequency: 'general-123asdf',
    createdAt: Date.now(),
    last_activity: Date.now(),
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
    timestamp: Date.now(),
    story: 'first-story-asdf123',
    message: {
      type: 'text',
      content: 'This is the first message!',
    },
  },
  {
    id: 'second-message-asdf123',
    timestamp: Date.now(),
    story: 'first-story-asdf123',
    message: {
      type: 'text',
      content: 'This is the second message!',
    },
  },
  {
    id: 'first-message-asdf123',
    timestamp: Date.now(),
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
