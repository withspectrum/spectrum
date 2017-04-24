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
  frequencies: [
    {
      id: 'first-frequency',
      community: 'first-community',
      createdAt: new Date('January 3, 2017'),
      modifiedAt: new Date('January 4, 2017'),
      name: 'First Frequency',
      description: 'The first!',
      slug: 'first',
      subscribers: ['first-user'],
    },
  ],
  stories: [
    {
      id: 'first-story',
      createdAt: new Date('January 4, 2017'),
      author: 'first-user',
      frequency: 'first-frequency',
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
      id: 'second-story',
      createdAt: new Date('January 5, 2017'),
      author: 'first-user',
      frequency: 'first-frequency',
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
        db.tableCreate('stories').run(),
        db.tableCreate('frequencies').run(),
        db.tableCreate('communities').run(),
        db.tableCreate('messages').run(),
        db.tableCreate('direct_messages').run(),
        db.tableCreate('sessions').run(),
        db.tableCreate('reactions').run(),
        db.tableCreate('direct_message_groups').run(),
        db.tableCreate('users', { primaryKey: 'uid' }).run(),
      ])
    )
    .then(result =>
      Promise.all([
        db.table('users').insert(data.users).run(),
        db.table('communities').insert(data.communities).run(),
        db.table('frequencies').insert(data.frequencies).run(),
        db.table('stories').insert(data.stories).run(),
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
