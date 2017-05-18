/**
 * Use a mock database
 */
export const db = require('rethinkdbdash')({
  db: 'testing',
});

export const data = {
  users: [
    {
      uid: 'first-user',
      createdAt: new Date('January 2, 2017'),
      displayName: 'First User',
      lastSeen: new Date('February 2, 2017'),
      photoURL: 'my-photo.jpg',
      email: 'first.user@gmail.com',
      username: 'first',
    },
  ],
  communities: [
    {
      id: 'first-community',
      createdAt: new Date('January 2, 2017'),
      name: 'First',
      slug: 'first',
      members: ['first-user'],
    },
  ],
  channels: [
    {
      id: 'first-channel',
      community: 'first-community',
      createdAt: new Date('January 3, 2017'),
      modifiedAt: new Date('January 4, 2017'),
      name: 'First Channel',
      description: 'The first!',
      slug: 'first',
      members: ['first-user'],
    },
  ],
  threads: [
    {
      id: 'first-thread',
      createdAt: new Date('January 4, 2017'),
      creatorId: 'first-user',
      channel: 'first-channel',
      modifiedAt: new Date('January 5, 2017'),
      published: true,
      content: {
        title: 'First!',
        body: 'What',
      },
      edits: [
        {
          timestamp: new Date('January 4, 2017'),
          content: {
            title: 'First!',
            body: 'What',
          },
        },
      ],
    },
    {
      id: 'second-thread',
      createdAt: new Date('January 5, 2017'),
      creatorId: 'first-user',
      channel: 'first-channel',
      modifiedAt: new Date('January 6, 2017'),
      published: true,
      content: {
        title: 'Second!',
      },
      edits: [
        {
          timestamp: new Date('January 5, 2017'),
          content: {
            title: 'First!',
          },
        },
      ],
    },
  ],
};

export const setup = db => {
  return db
    .dbCreate('testing')
    .run()
    .then(() =>
      Promise.all([
        db.tableCreate('threads').run(),
        db.tableCreate('channels').run(),
        db.tableCreate('communities').run(),
        db.tableCreate('messages').run(),
        db.tableCreate('sessions').run(),
        db.tableCreate('reactions').run(),
        db.tableCreate('directMessageThreads').run(),
        db.tableCreate('users', { primaryKey: 'id' }).run(),
      ])
    )
    .then(result =>
      Promise.all([
        db.table('users').insert(data.users).run(),
        db.table('communities').insert(data.communities).run(),
        db.table('channels').insert(data.channels).run(),
        db.table('threads').insert(data.threads).run(),
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
