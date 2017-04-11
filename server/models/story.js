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
        edits: [
          {
            timestamp: new Date(),
            content: story.content,
          },
        ],
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

const setStoryLock = (id, value) => {
  const { connection } = require('./db');
  return (
    db
      .table('stories')
      .get(id)
      // Note(@mxstbr): There surely is a better way to toggle a bool
      // with ReQL, I just couldn't find the API for it in a pinch
      .update(
        {
          locked: value,
        },
        { returnChanges: true }
      )
      .run(connection)
      .then(
        result =>
          result.changes.length > 0
            ? result.changes[0].new_val
            : db.table('stories').get(id).run(connection)
      )
  );
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

const editStory = (id, newContent) => {
  const { connection } = require('./db');
  return db
    .table('stories')
    .get(id)
    .update(
      {
        content: newContent,
        modifiedAt: new Date(),
        edits: db.row('edits').append({
          content: newContent,
          timestamp: new Date(),
        }),
      },
      { returnChanges: true }
    )
    .run(connection)
    .then(result => result.changes[0].new_val);
};

module.exports = {
  addStory,
  getStory,
  publishStory,
  editStory,
  setStoryLock,
  deleteStory,
  getStoryByFrequency,
};
