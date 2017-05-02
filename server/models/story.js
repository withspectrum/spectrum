// @flow
/**
 * Storing and retrieving stories
 */
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');
const { storeStoryNotification } = require('./notification');

const getStory = id => {
  return db.table('stories').get(id).run();
};

const getStoriesByFrequency = (frequency, { first, after }) => {
  const getStories = db
    .table('stories')
    .between(after || db.minval, db.maxval, { leftBound: 'open' })
    .orderBy('modifiedAt')
    .filter({ frequency })
    .limit(first)
    .run()
    .then();

  const getLastStory = db
    .table('stories')
    .orderBy('modifiedAt')
    .filter({ frequency })
    .max()
    .run();

  return Promise.all([getStories, getLastStory]);
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
    .then(result => result.changes[0].new_val)
    .then(story => {
      storeStoryNotification({
        story: story.id,
        frequency: story.frequency,
        sender: story.author,
        content: {
          title: story.content.title,
          // TODO Limit to max characters
          excerpt: story.content.description,
        },
      });
      return story;
    });
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

const listenToNewStories = cb => {
  return listenToNewDocumentsIn('stories', cb);
};

module.exports = {
  addStory,
  getStory,
  publishStory,
  editStory,
  setStoryLock,
  deleteStory,
  listenToNewStories,
  getStoriesByFrequency,
};
