'use strict';
const compose = require('redux/lib/compose').default;
const { convertToRaw } = require('draft-js');
const { stateFromMarkdown } = require('draft-js-import-markdown');
const { toPlainText, toState } = require('../../shared/slate-utils');

const slateToDraft = compose(
  JSON.stringify,
  convertToRaw,
  stateFromMarkdown,
  toPlainText,
  toState,
  JSON.parse
);

exports.up = function(r, conn) {
  return (
    r
      .table('threads')
      .filter({ type: 'SLATE' })
      .run(conn)
      .then(cursor => cursor.toArray())
      // Transform slate state to draftjs state
      .then(threads =>
        threads.map(thread =>
          Object.assign({}, thread, {
            type: 'DRAFTJS',
            content: Object.assign({}, thread.content, {
              body: slateToDraft(thread.content.body),
            }),
          })
        )
      )
      // Store the transformed threads
      .then(threads =>
        Promise.all(
          threads.map(thread =>
            r.table('threads').get(thread.id).update(thread).run(conn)
          )
        )
      )
  );
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
