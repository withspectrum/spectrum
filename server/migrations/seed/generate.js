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

const generateCommunity = () => {
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
  };
};

const generateChannel = communityId => {
  const name = faker.commerce.department();

  return {
    id: uuid(),
    communityId,
    createdAt: faker.date.past(2),
    name,
    description: casual.short_description(),
    slug: slugify(name),
    isPrivate: faker.random.boolean(),
  };
};

const generateUsersCommunities = (communityId, userId) => {
  const isOwner = faker.random.boolean();
  // for ease of use, set to false
  const isModerator = false;
  // if user is either an admin or moderator, they have to be a member
  // otherwise random chance
  const isMember = isOwner || isModerator ? true : faker.random.boolean();
  // might be blocked as long as they aren't an admin, mod, or member
  const isBlocked = isOwner || isModerator || isMember
    ? false
    : faker.random.boolean();

  return {
    id: uuid(),
    createdAt: faker.date.past(2),
    communityId,
    userId,
    isOwner,
    isModerator,
    isMember,
    isBlocked,
  };
};

const generateUsersChannels = (channels, usersCommunities, userId) => {
  // figure out which communities the user being evaulated is a member of
  let possibleCommunities = usersCommunities.filter(
    elem => elem.userId === userId
  );
  // make sure they are a member of the community
  possibleCommunities = possibleCommunities
    .filter(elem => elem.isMember || elem.isOwner || elem.isModerator)
    .map(elem => elem.communityId);
  let possibleChannels = channels.filter(
    channel => possibleCommunities.indexOf(channel.communityId) > -1
  );

  // for each of those communities, construct an array of channels that are in
  // that community
  // const possibleChannels = possibleCommunities.map(community => channels.filter(channel => channel.communityId === community.id))

  // for each of hte possible channels, generate a new usersChannels object
  const foo = possibleChannels.map(channel => {
    const isOwner = faker.random.boolean();
    // for ease of use, set to false
    const isModerator = false;
    // if user is either an admin or moderator, they have to be a member
    // otherwise random chance
    const isMember = isOwner || isModerator ? true : faker.random.boolean();
    // if a user is admin, mod, or member, they can't be pending, otherwise random
    const isPending = isOwner || isModerator || isMember
      ? false
      : faker.random.boolean();
    // might be blocked as long as they aren't an admin, mod, pending, or member
    const isBlocked = isOwner || isModerator || isMember || isPending
      ? false
      : faker.random.boolean();

    return {
      id: uuid(),
      createdAt: new Date(),
      channelId: channel.id,
      userId,
      isOwner,
      isModerator,
      isMember,
      isBlocked,
      isPending,
    };
  });
  return foo;
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
    messageType: 'text',
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
  generateUsersCommunities,
  generateUsersChannels,
  generateThread,
  generateMessage,
  generateReaction,
  generateThreadNotification,
  generateMessageNotification,
  generateDirectMessageThread,
};
