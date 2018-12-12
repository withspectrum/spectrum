// @flow
const faker = require('faker');
const debug = require('debug')('api:migrations:seed');
const { v4: uuid } = require('uuid');
const {
  defaultCommunities,
  defaultUsers,
  defaultChannels,
  defaultThreads,
  defaultUsersThreads,
  defaultDirectMessageThreads,
  defaultUsersDirectMessageThreads,
  defaultUsersCommunities,
  defaultUsersChannels,
  defaultMessages,
} = require('./default/index');

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
  ...defaultUsers,
  ...randomAmount({ max: userAmount, min: 1 }, generateUser),
];

const usersSettings = [];
users.forEach(user => {
  usersSettings.push(generateUsersSettings(user.id));
});

debug('Generating communities...');
const communities = [
  ...defaultCommunities,
  ...randomAmount({ min: 10, max: 20 }, () => {
    return generateCommunity();
  }),
];

debug('Generating usersCommunities...');
let usersCommunities = [];
users.forEach(user => {
  communities.forEach(community => {
    usersCommunities.push(generateUsersCommunities(community.id, user.id));
  });
});

debug('Generating channels...');
let channels = defaultChannels;
communities.forEach(community => {
  if (community.deletedAt) return;
  randomAmount({ max: 10 }, () => {
    channels.push(generateChannel(community.id));
  });
});

debug('Generating usersChannels...');
let usersChannels = defaultUsersChannels;
const generatedUsersChannels = users.map(user => {
  return generateUsersChannels(channels, usersCommunities, user.id);
});
generatedUsersChannels.map(elem => {
  usersChannels.push(...elem);
});

debug('Generating threads...');
let threads = defaultThreads;
channels.forEach(channel => {
  const community = communities.find(
    community => community.id === channel.communityId
  );
  if (community.deletedAt) return;

  randomAmount({ max: 10 }, () => {
    const creator = faker.random.arrayElement(users);
    const thread = generateThread(channel.communityId, channel.id, creator.id);
    threads.push(thread);
  });
});

let usersThreads = defaultUsersThreads;
threads.forEach(thread => {
  const usersThread = generateUsersThreads(thread.id, thread.creatorId);
  usersThreads.push(usersThread);
});

debug('Generating direct message threads...');
let directMessageThreads = defaultDirectMessageThreads;
randomAmount({ max: 100 }, () => {
  directMessageThreads.push(generateDirectMessageThread());
});

debug('Generating usersDirectMessageThreads...');
let usersDirectMessageThreads = defaultUsersDirectMessageThreads;
directMessageThreads.forEach(thread => {
  const thread_users = randomAmount({ max: 5, min: 2 }, i => users[i]);

  thread_users.forEach(user => {
    usersDirectMessageThreads.push(
      generateUsersDirectMessageThreads(thread.id, user.id)
    );
  });
});

debug('Generating messages...');
let messages = defaultMessages;
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

debug('Generating direct messages...');
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

debug('Generating reactions...');
let reactions = [];
messages.map(message => {
  randomAmount({ max: 5 }, () => {
    const user = faker.random.arrayElement(users);
    reactions.push(generateReaction(user.id, message.id));
  });
});

debug('Connecting to db...');
// $FlowFixMe
const db = require('rethinkhaberdashery')({
  db: 'spectrum',
});

debug(
  `Inserting ${users.length} users,
  ${communities.length} communities, ${channels.length} channels, ${
    threads.length
  } threads, ${messages.length + direct_messages.length} messages, ${
    reactions.length
  } reactions, ${directMessageThreads.length} direct message threads, ${
    usersCommunities.length
  } usersCommunities objects, ${
    usersChannels.length
  } usersChannels objects, and ${
    usersDirectMessageThreads.length
  } usersDirectMessageThreads objects into the database... (this might take a while!)`
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
    debug('Finished seeding database! 🎉');
    process.exit();
  })
  .catch(err => {
    debug(
      'Encountered error while inserting data (see below), please run yarn run db:drop and yarn run db:migrate to restore tables to original condition, then run this script again.'
    );
    console.error('❌ Error in job:\n');
    console.error(err);
  });
