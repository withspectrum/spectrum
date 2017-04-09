const r = require('rethinkdb');

if (process.env.NODE_ENV === 'production') {
  throw new Error('Do not use the migration script in production!');
  process.exit(1);
}

let connection = null;

r
  .connect({ host: 'localhost', port: 28015 })
  .then(conn => {
    connection = conn;
    return r.db('test').tableCreate('stories').run(conn);
  })
  .then(() => r.db('test').tableCreate('frequencies').run(connection))
  .then(() => r
    .table('frequencies')
    .insert([
      {
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        name: 'First frequency',
        description: 'This is the only frequency in the migration script!',
        slug: 'first',
        stories: [],
      },
    ])
    .run(connection))
  .then(result => Promise.all([
    result.generated_keys[0],
    r
      .table('stories')
      .insert([
        {
          createdAt: Date.now(),
          last_activity: Date.now(),
          published: true,
          content: {
            title: 'First story!',
            description: 'Welcome to RethinkDB.',
          },
          frequency: result.generated_keys[0],
        },
      ])
      .run(connection),
  ]))
  .then(([frequency, result]) => r
    .table('frequencies')
    .get(frequency)
    .update({
      stories: r.row('stories').append(result.generated_keys[0]),
    })
    .run(connection))
  .then(() => {
    process.exit();
  })
  .catch(err => {
    throw err;
  });
