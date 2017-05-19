// @flow
// $FlowFixMe
const { v4: uuid } = require('uuid');
// $FlowFixMe
const faker = require('faker');
// $FlowFixMe
const slugify = require('slugg');
// $FlowFixMe
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
    id: uuid(),
    name,
    description: casual.short_description(),
    website: faker.internet.url(),
    username: faker.internet.userName(name),
    profilePhoto: faker.internet.avatar(),
    coverPhoto: faker.image.image(),
    email: faker.internet.email(name),
    providerId: uuid(),
    subscriptions: [],
    createdAt,
    // Make sure lastSeen is > createdAt
    lastSeen: faker.date.between(createdAt, new Date()),
  };
};

const generateCommunity = members => {
  const name = faker.company.companyName();
  return {
    id: uuid(),
    createdAt: faker.date.past(2),
    name,
    description: casual.short_description(),
    website: faker.internet.url(),
    profilePhoto: faker.image.business(),
    coverPhoto: faker.image.image(),
    slug: slugify(name),
    members,
    owners: [members[0]],
    moderators: [],
    blockedUsers: [],
  };
};

const generateChannel = (communityId, members) => {
  const name = faker.commerce.department();

  return {
    id: uuid(),
    communityId,
    createdAt: faker.date.past(2),
    name,
    description: casual.short_description(),
    slug: slugify(name),
    isPrivate: faker.random.boolean(),
    members,
    owners: [members[0]],
    moderators: [],
    pendingUsers: [],
    blockedUsers: [],
  };
};

const generateThread = (communityId, channelId, creatorId) => {
  const content = {
    title: casual.title(),
    body: casual.text(),
  };

  const createdAt = faker.date.past(2);

  return {
    id: uuid(),
    createdAt,
    creatorId,
    channelId,
    communityId,
    isPublished: faker.random.boolean(),
    content,
    attachments: [],
    edits: [
      {
        timestamp: createdAt,
        content,
      },
    ],
    modifiedAt: faker.date.between(createdAt, new Date()),
  };
};

const generateDirectMessageThread = users => {
  const createdAt = faker.date.past(2);
  const lastActivity = faker.date.between(createdAt, faker.date.recent());
  const lastSeen = faker.date.between(createdAt, new Date());

  return {
    id: uuid(),
    creatorId: users[0].id,
    name: null,
    createdAt,
    lastActivity: faker.date.between(lastActivity, new Date()),
    participants: users.map(user => user.id),
    status: users.map(user => {
      return {
        userId: user.id,
        lastActivity,
        lastSeen,
      };
    }),
  };
};

const generateMessage = (senderId, threadId, threadType) => {
  return {
    id: uuid(),
    threadType,
    threadId,
    senderId,
    content: {
      body: casual.text(),
    },
    attachments: [],
    type: 'text',
    timestamp: faker.date.past(2),
  };
};

const generateReaction = (userId, messageId) => {
  return {
    id: uuid(),
    messageId,
    userId,
    timestamp: faker.date.past(2),
    type: 'like',
  };
};

const generateThreadNotification = (thread, channel, communityId, callback) => {
  return generateNotification(
    channel.members,
    thread.creatorId,
    thread.id,
    channel.id,
    communityId,
    thread.content.title,
    // TODO: Add a maximum length to this
    thread.content.body
  );
};

const generateMessageNotification = (
  users,
  message,
  thread,
  channelId,
  communityId
) => {
  return generateNotification(
    users,
    message.senderId,
    thread.id,
    channelId,
    communityId,
    thread.content.title,
    // TODO: Add a maximum length to this
    message.content.body,
    message.id
  );
};

// SCHEMA:TODO
const generateNotification = (
  users,
  senderId,
  threadId,
  channelId,
  communityId,
  title,
  excerpt,
  message
) => {
  return {
    id: uuid(),
    createdAt: faker.date.past(2),
    users: users.map(id => ({
      id,
      read: faker.random.boolean(),
    })),
    type: message ? 'NEW_MESSAGE' : 'NEW_THREAD',
    message,
    threadId,
    channelId,
    communityId,
    senderId,
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
  generateChannel,
  generateThread,
  generateMessage,
  generateReaction,
  generateThreadNotification,
  generateMessageNotification,
  generateDirectMessageThread,
};
