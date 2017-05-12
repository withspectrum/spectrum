``; /**
 * Seed the database with some randomly generated data
 */
const { v4: uuid } = require('uuid');
const faker = require('faker');
const slugify = require('slugg');
const casual = require('casual').functions();

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
    slug: slugify(name),
    members,
    description: casual.short_description(),
    owners: [members[0]],
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
    description: casual.short_description(),
    slug: slugify(name),
    subscribers,
    owners: [subscribers[0]],
  };
};

const generateStory = (community, frequency, author) => {
  const createdAt = faker.date.past(2);
  const content = {
    title: casual.title(),
    description: casual.text(),
  };
  return {
    id: uuid(),
    createdAt,
    author,
    frequency,
    community,
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

const generateDirectMessageGroup = users => {
  const createdAt = faker.date.past(2);
  const lastActivity = faker.date.between(createdAt, faker.date.recent());
  const lastSeen = faker.date.between(createdAt, new Date());
  return {
    id: uuid(),
    createdAt,
    creator: users[0].uid,
    users: users.map(user => user.uid),
    status: users.map(user => {
      return {
        uid: user.uid,
        lastActivity,
        lastSeen,
      };
    }),
    lastActivity: faker.date.between(lastActivity, new Date()),
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
      content: casual.text(),
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

const generateStoryNotification = (story, frequency, communityId, callback) => {
  return generateNotification(
    frequency.subscribers,
    story.author,
    story.id,
    frequency.id,
    communityId,
    story.content.title,
    // TODO: Add a maximum length to this
    story.content.description
  );
};

const generateMessageNotification = (
  users,
  message,
  story,
  frequencyId,
  communityId
) => {
  return generateNotification(
    users,
    message.sender,
    story.id,
    frequencyId,
    communityId,
    story.content.title,
    // TODO: Add a maximum length to this
    message.message.content,
    message.id
  );
};

const generateNotification = (
  users,
  sender,
  story,
  frequency,
  community,
  title,
  excerpt,
  message
) => {
  return {
    id: uuid(),
    createdAt: faker.date.past(2),
    users: users.map(uid => ({
      uid,
      read: faker.random.boolean(),
    })),
    type: message ? 'NEW_MESSAGE' : 'NEW_STORY',
    message,
    story,
    frequency,
    community,
    sender,
    content: {
      title,
      excerpt,
    },
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
  generateStoryNotification,
  generateMessageNotification,
  generateDirectMessageGroup,
};
