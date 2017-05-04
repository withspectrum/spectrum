/**
 * Storing and retrieving stories
 */
const { db } = require('./db');

const getStory = id => {
  return db.table('stories').get(id).run();
};

const getStoriesByFrequency = (frequency, { first, after }) => {
  const getStories = db
    .table('stories')
    .between(after || db.minval, db.maxval, { leftBound: 'open' })
    .orderBy(db.desc('modifiedAt'))
    .filter({ frequency, published: true })
    .limit(first)
    .run()
    .then();

  const getLastStory = db
    .table('stories')
    .orderBy('modifiedAt')
    .filter({ frequency, published: true })
    .max()
    .run();

  return Promise.all([getStories, getLastStory]);
};

const getStoriesByUser = (uid, { first, after }) => {
  const getStories = db
    .table('stories')
    .between(after || db.minval, db.maxval, { leftBound: 'open' })
    .orderBy(db.desc('modifiedAt'))
    .filter({ author: uid, published: true })
    .limit(first)
    .run()
    .then();

  const getLastStory = db
    .table('stories')
    .orderBy('modifiedAt')
    .filter({ author: uid, published: true })
    .max()
    .run();

  return Promise.all([getStories, getLastStory]);
};

const publishStory = (story, user) => {
  return db
    .table('stories')
    .insert(
      Object.assign({}, story, {
        author: user.uid,
        createdAt: new Date(),
        modifiedAt: new Date(),
        published: true,
      }),
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
          (result.changes.length > 0
            ? result.changes[0].new_val
            : db.table('stories').get(id).run())
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
  getStory,
  publishStory,
  editStory,
  setStoryLock,
  deleteStory,
  getStoriesByFrequency,
  getStoriesByUser,
};
