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
  return {
    uid: uuid(),
    createdAt,
    displayName: faker.name.findName(),
    // Make sure lastSeen is > createdAt
    lastSeen: faker.date.between(createdAt, new Date()),
    photoURL: faker.image.people(),
    username: uuid(),
  };
};

const generateCommunity = members => ({
  id: uuid(),
  createdAt: faker.date.past(2),
  name: faker.company.companyName(),
  slug: uuid(),
  members,
});

const generateFrequency = (community, subscribers) => {
  const createdAt = faker.date.past(2);
  return {
    id: uuid(),
    community,
    createdAt,
    modifiedAt: faker.date.between(createdAt, new Date()),
    name: faker.commerce.department(),
    description: faker.lorem.sentences(),
    slug: uuid(),
    subscribers,
  };
};

const generateStory = (frequency, author) => {
  const createdAt = faker.date.past(2);
  const content = {
    title: faker.lorem.sentences(),
    description: faker.lorem.lines(),
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
      content: faker.lorem.lines(),
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
