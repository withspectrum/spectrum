/**
 * Storing and retrieving stories
 */
const { db } = require('./db');

const getStory = id => {
  const { connection } = require('./db');
  return db.table('stories').get(id).run(connection);
};

const getStoryByFrequency = frequency => {
  const { connection } = require('./db');
  return db.table('stories').filter({ frequency }).run(connection).then(
    cursor =>
      new Promise(resolve => {
        cursor.toArray((err, result) => {
          if (err) throw err;
          resolve(result);
        });
      })
  );
};

const addStory = story => {
  const { connection } = require('./db');
  return db
    .table('stories')
    .insert(
      Object.assign({}, story, {
        createdAt: new Date(),
        modifiedAt: new Date(),
      }),
      { returnChanges: true }
    )
    .run(connection)
    .then(result => result.changes[0].new_val);
};

const publishStory = id => {
  const { connection } = require('./db');
  return db
    .table('stories')
    .get(id)
    .update(
      {
        published: true,
        modifiedAt: new Date(),
      },
      { returnChanges: true }
    )
    .run(connection)
    .then(result => result.changes[0].new_val);
};

const deleteStory = id => {
  const { connection } = require('./db');
  return db
    .table('stories')
    .get(id)
    .delete()
    .run(connection)
    .then(result => result.deleted === 1);
};

module.exports = {
  addStory,
  getStory,
  publishStory,
  deleteStory,
  getStoryByFrequency,
};
