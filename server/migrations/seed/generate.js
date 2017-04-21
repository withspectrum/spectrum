/**
 * Seed the database with some randomly generated data
 */
const { v4: uuid } = require('uuid');
const faker = require('faker');

const randomAmount = ({ max, min }, cb) => {
  if (!max) throw new Error('randomAmount({ max }): max has to be defined!');
  const n = faker.random.number({ min: min || 0, max });
  let result = [];
  for (var i = 0; i < n; i++) {
    result.push(cb(i));
  }
  return result;
};

const generateUser = () => {
  const createdAt = faker.date.past(2);
  const name = faker.name.findName();
  return {
    uid: uuid(),
    createdAt,
    displayName: name,
    // Make sure lastSeen is > createdAt
    lastSeen: faker.date.between(createdAt, new Date()),
    photoURL: faker.internet.avatar(),
    email: faker.internet.email(name),
    username: faker.internet.userName(name),
  };
};

const generateCommunity = members => {
  const name = faker.company.companyName();
  return {
    id: uuid(),
    createdAt: faker.date.past(2),
    name,
    slug: faker.helpers.slugify(name),
    members,
  };
};

const generateFrequency = (community, subscribers) => {
  const createdAt = faker.date.past(2);
  const name = faker.commerce.department();
  return {
    id: uuid(),
    community,
    createdAt,
    modifiedAt: faker.date.between(createdAt, new Date()),
    name,
    description: faker.random.words(faker.random.number({ min: 1, max: 20 })),
    slug: faker.helpers.slugify(name),
    subscribers,
  };
};

const generateStory = (frequency, author) => {
  const createdAt = faker.date.past(2);
  const content = {
    title: faker.random.words(faker.random.number({ min: 1, max: 10 })),
    description: faker.random.words(faker.random.number({ min: 1, max: 100 })),
  };
  return {
    id: uuid(),
    createdAt,
    author,
    frequency,
    modifiedAt: faker.date.between(createdAt, new Date()),
    published: faker.random.boolean(),
    content,
    edits: [
      {
        timestamp: createdAt,
        content,
      },
    ],
  };
};

const generateMessage = (sender, thread) => {
  return {
    id: uuid(),
    timestamp: faker.date.past(2),
    thread,
    sender,
    message: {
      type: 'text',
      content: faker.random.words(faker.random.number({ min: 1, max: 20 })),
    },
  };
};

const generateReaction = (user, message) => {
  return {
    id: uuid(),
    user,
    message,
    timestamp: faker.date.past(2),
    type: 'like',
  };
};

module.exports = {
  randomAmount,
  generateUser,
  generateCommunity,
  generateFrequency,
  generateStory,
  generateMessage,
  generateReaction,
};
