/**
 * Storing and retrieving stories
 */
const { db } = require('./db');

const getStory = id => {
  return db.table('stories').get(id).run();
};

const getStoryByFrequency = frequency => {
  return db.table('stories').filter({ frequency }).run();
};

const addStory = story => {
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
    .run()
    .then(result => result.changes[0].new_val);
};

const publishStory = id => {
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
    .run()
    .then(result => result.changes[0].new_val);
};

const setStoryLock = (id, value) => {
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
      .run()
      .then(
        result =>
          result.changes.length > 0
            ? result.changes[0].new_val
            : db.table('stories').get(id).run()
      )
  );
};

const deleteStory = id => {
  return db
    .table('stories')
    .get(id)
    .delete()
    .run()
    .then(result => result.deleted === 1);
};

const editStory = (id, newContent) => {
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
    .run()
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
