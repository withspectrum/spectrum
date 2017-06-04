/**
 * Use a mock database
 */
export const db = require('rethinkdbdash')({
  db: 'testing',
});

const {
  DEFAULT_USERS,
  DEFAULT_COMMUNITIES,
  DEFAULT_CHANNELS,
  DEFAULT_THREADS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_DIRECT_MESSAGE_THREADS,
  DEFAULT_USERS_COMMUNITIES,
  DEFAULT_USERS_CHANNELS,
} = require('../migrations/seed/default');

export const data = {
  users: DEFAULT_USERS,
  communities: DEFAULT_COMMUNITIES,
  channels: DEFAULT_CHANNELS,
  threads: DEFAULT_THREADS,
  notifications: DEFAULT_NOTIFICATIONS,
  directMessageThreads: DEFAULT_DIRECT_MESSAGE_THREADS,
  usersDirectMessageThreads: DEFAULT_USERS_DIRECT_MESSAGE_THREADS,
  usersCommunities: DEFAULT_USERS_COMMUNITIES,
  usersChannels: DEFAULT_USERS_CHANNELS,
};

export const setup = db => {
  return db
    .dbCreate('testing')
    .run()
    .then(() =>
      Promise.all([
        db.tableCreate('communities').run(),
        db.tableCreate('channels').run(),
        db.tableCreate('threads').run(),
        // db.tableCreate('messages').run(),
        db.tableCreate('users').run(),
        // db.tableCreate('reactions').run(),
        db.tableCreate('notifications').run(),
        db.tableCreate('directMessageThreads').run(),
        db.tableCreate('usersCommunities').run(),
        db.tableCreate('usersChannels').run(),
        db.tableCreate('usersDirectMessageThreads').run(),
      ])
    )
    .then(result =>
      Promise.all([
        db.table('communities').insert(DEFAULT_COMMUNITIES).run(),
        db.table('channels').insert(DEFAULT_CHANNELS).run(),
        db.table('threads').insert(DEFAULT_THREADS).run(),
        // db.table('messages').insert(DEFAULT_MESSAGES).run(),
        db.table('users').insert(DEFAULT_USERS).run(),
        // db.table('reactions').insert(DEFAULT_REACTIONS).run(),
        db.table('notifications').insert(DEFAULT_NOTIFICATIONS).run(),
        db
          .table('directMessageThreads')
          .insert(DEFAULT_DIRECT_MESSAGE_THREADS)
          .run(),
        db.table('usersCommunities').insert(DEFAULT_USERS_COMMUNITIES).run(),
        db.table('usersChannels').insert(DEFAULT_USERS_CHANNELS).run(),
        db
          .table('usersDirectMessageThreads')
          .insert(DEFAULT_USERS_DIRECT_MESSAGE_THREADS)
          .run(),
      ])
    )
    .catch(err => {
      console.log(err);
    });
};

export const teardown = db =>
  db.dbDrop('testing').run().catch(err => {
    console.log(err);
  });
