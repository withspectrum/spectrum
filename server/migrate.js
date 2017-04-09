const r = require('rethinkdb');

let connection = null;

r
  .connect({ host: 'localhost', port: 28015 })
  .then(conn => {
    connection = conn;
    return r.db('test').tableCreate('stories').run(conn);
  })
  .then(() => r
    .table('stories')
    .insert([
      {
        id: 'asdf123',
        createdAt: Date.now(),
        last_activity: Date.now(),
        published: true,
        content: {
          title: 'First story!',
          description: 'Welcome to RethinkDB.',
        },
      },
    ])
    .run(connection))
  .then(() => {
    process.exit();
  })
  .catch(err => {
    throw err;
  });
