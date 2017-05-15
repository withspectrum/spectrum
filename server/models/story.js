// @flow
/**
 * Storing and retrieving stories
 */
const { db } = require('./db');
const { listenToNewDocumentsIn } = require('./utils');
const { storeStoryNotification } = require('./notification');

const getStories = (ids: Array<string>) => {
  return db
    .table('stories')
    .getAll(...ids)
    .filter(story => db.not(story.hasFields('deleted')))
    .run();
};

const getStoriesByFrequency = (frequency, { first, after }) => {
  return db
    .table('stories')
    .getAll(frequency, { index: 'frequency' })
    .filter(story => db.not(story.hasFields('deleted')))
    .orderBy(db.desc('createdAt'))
    .run();
};

const getStoriesByUser = (uid, { first, after }) => {
  return db
    .table('stories')
    .getAll(uid, { index: 'author' })
    .filter(story => db.not(story.hasFields('deleted')))
    .orderBy(db.desc('createdAt'))
    .run();
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
    .update(
      {
        deleted: db.now(),
      },
      {
        returnChanges: true,
        nonAtomic: true,
      }
    )
    .run()
    .then(result => {
      // update was successful
      if (result.replaced >= 1) {
        return true;
      }
    });
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
  getStories,
  publishStory,
  editStory,
  setStoryLock,
  deleteStory,
  listenToNewStories,
  getStoriesByFrequency,
  getStoriesByUser,
};
