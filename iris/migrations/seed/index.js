// @flow
//$FlowFixMe
const faker = require('faker');
//$FlowFixMe
const { v4: uuid } = require('uuid');
const {
  DEFAULT_COMMUNITIES,
  DEFAULT_USERS,
  DEFAULT_CHANNELS,
  DEFAULT_THREADS,
  DEFAULT_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_COMMUNITIES,
  DEFAULT_USERS_CHANNELS,
} = require('./default');

const {
  randomAmount,
  generateUser,
  generateUsersSettings,
  generateCommunity,
  generateChannel,
  generateUsersCommunities,
  generateUsersChannels,
  generateThread,
  generateUsersThreads,
  generateDirectMessageThread,
  generateUsersDirectMessageThreads,
  generateMessage,
  generateReaction,
} = require('./generate');

const userAmount = faker.random.number(1000);
const users = [
  ...DEFAULT_USERS,
  ...randomAmount({ max: userAmount, min: 1 }, generateUser),
];

const usersSettings = [];
users.forEach(user => {
  usersSettings.push(generateUsersSettings(user.id));
});

console.log('Generating communities...');
const communities = [
  ...DEFAULT_COMMUNITIES,
  ...randomAmount({ min: 10, max: 20 }, () => {
    return generateCommunity();
  }),
];

console.log('Generating usersCommunities...');
let usersCommunities = [];
users.forEach(user => {
  communities.forEach(community => {
    usersCommunities.push(generateUsersCommunities(community.id, user.id));
  });
});

console.log('Generating channels...');
let channels = DEFAULT_CHANNELS;
communities.forEach(community => {
  randomAmount({ max: 10 }, () => {
    channels.push(generateChannel(community.id));
  });
});

console.log('Generating default general channels...');
communities.forEach(community => {
  channels.push({
    id: uuid(),
    communityId: community.id,
    createdAt: new Date(),
    modifiedAt: new Date(),
    name: 'General',
    description: 'General chatter',
    slug: 'general',
    isPrivate: false,
    isDefault: true,
  });
});

console.log('Generating usersChannels...');
let usersChannels = DEFAULT_USERS_CHANNELS;
const generatedUsersChannels = users.map(user => {
  return generateUsersChannels(channels, usersCommunities, user.id);
});
generatedUsersChannels.map(elem => {
  usersChannels.push(...elem);
});

console.log('Generating threads...');
let threads = DEFAULT_THREADS;
channels.forEach(channel => {
  randomAmount({ max: 10 }, () => {
    const creator = faker.random.arrayElement(users);
    const thread = generateThread(channel.communityId, channel.id, creator.id);
    threads.push(thread);
  });
});

let usersThreads = [];
threads.forEach(thread => {
  const usersThread = generateUsersThreads(thread.id, thread.creatorId);
  usersThreads.push(usersThread);
});

console.log('Generating direct message threads...');
let directMessageThreads = DEFAULT_DIRECT_MESSAGE_THREADS;
randomAmount({ max: 100 }, () => {
  directMessageThreads.push(generateDirectMessageThread());
});

console.log('Generating usersDirectMessageThreads...');
let usersDirectMessageThreads = DEFAULT_USERS_DIRECT_MESSAGE_THREADS;
directMessageThreads.forEach(thread => {
  const thread_users = randomAmount({ max: 5, min: 2 }, i => users[i]);

  thread_users.forEach(user => {
    usersDirectMessageThreads.push(
      generateUsersDirectMessageThreads(thread.id, user.id)
    );
  });
});

console.log('Generating messages...');
let messages = [];
threads.forEach(thread => {
  const channel = channels.find(channel => channel.id === thread.channelId);
  const threadMessages = [];
  randomAmount({ max: 10 }, () => {
    const sender = faker.random.arrayElement(users);
    const message = generateMessage(sender.id, thread.id, 'story');
    messages.push(message);
    threadMessages.push(message);
  });
});

console.log('Generating direct messages...');
let direct_messages = [];
usersDirectMessageThreads.forEach(thread => {
  const threadMessages = [];
  const sender = thread.userId;
  randomAmount({ max: 100 }, () => {
    const message = generateMessage(
      sender,
      thread.threadId,
      'directMessageThread'
    );
    direct_messages.push(message);
    threadMessages.push(message);
  });
});

console.log('Generating reactions...');
let reactions = [];
messages.map(message => {
  randomAmount({ max: 5 }, () => {
    const user = faker.random.arrayElement(users);
    reactions.push(generateReaction(user.id, message.id));
  });
});

console.log('Connecting to db...');
// $FlowFixMe
const db = require('rethinkdbdash')({
  db: 'spectrum',
});

console.log(
  `Inserting ${users.length} users,
  ${communities.length} communities, ${channels.length} channels, ${threads.length} threads, ${messages.length +
    direct_messages.length} messages, ${reactions.length} reactions, ${directMessageThreads.length} direct message threads, ${usersCommunities.length} usersCommunities objects, ${usersChannels.length} usersChannels objects, and ${usersDirectMessageThreads.length} usersDirectMessageThreads objects into the database... (this might take a while!)`
);
Promise.all([
  db
    .table('communities')
    .insert(communities)
    .run(),
  db
    .table('channels')
    .insert(channels)
    .run(),
  db
    .table('threads')
    .insert(threads)
    .run(),
  db
    .table('messages')
    .insert(messages)
    .run(),
  db
    .table('users')
    .insert(users)
    .run(),
  db
    .table('usersSettings')
    .insert(usersSettings)
    .run(),
  db
    .table('reactions')
    .insert(reactions)
    .run(),
  db
    .table('directMessageThreads')
    .insert(directMessageThreads)
    .run(),
  db
    .table('messages')
    .insert(direct_messages)
    .run(),
  db
    .table('usersCommunities')
    .insert(usersCommunities)
    .run(),
  db
    .table('usersChannels')
    .insert(usersChannels)
    .run(),
  db
    .table('usersDirectMessageThreads')
    .insert(usersDirectMessageThreads)
    .run(),
  db
    .table('usersThreads')
    .insert(usersThreads)
    .run(),
])
  .then(() => {
    console.log('Finished seeding database! 🎉');
    process.exit();
  })
  .catch(err => {
    console.log(
      'Encountered error while inserting data (see below), please run yarn run db:drop and yarn run db:migrate to restore tables to original condition, then run this script again.'
    );
    console.log(err);
  });
