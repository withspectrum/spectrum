const compose = require('redux/lib/compose').default;
const { convertToRaw, genKey } = require('draft-js');
const { stateFromMarkdown } = require('draft-js-import-markdown');
const isHtml = require('is-html');
const cheerio = require('cheerio');
const { toPlainText, toState } = require('../../shared/slate-utils');

const convertEmbeds = state => {
  const entityMap = state.entityMap || {};
  const blocks = state.blocks.map(block => {
    if (block.type !== 'unstyled') return block;
    if (!isHtml(block.text)) return block;

    const $ = cheerio.load(block.text);
    const iframe = $('iframe')[0];

    if (!iframe) return block;

    const src = $(iframe).attr('src');
    const height = $(iframe).attr('height');
    const width = $(iframe).attr('width');

    if (!src) return block;

    const keys = Object.keys(entityMap).map(key => parseInt(key, 10));
    const lastKey = keys.sort()[keys.length - 1];
    const newKey = lastKey === undefined ? 0 : lastKey + 1;

    entityMap[newKey] = {
      data: { src, height, width },
      mutability: 'IMMUTABLE',
      type: 'embed',
    };

    return {
      data: {},
      depth: 0,
      entityRanges: [
        {
          key: newKey,
          offset: 0,
          length: 1,
        },
      ],
      inlineStyleRanges: [],
      key: genKey(),
      text: ' ',
      type: 'atomic',
    };
  });

  return {
    ...state,
    entityMap,
    blocks,
  };
};

const plainToDraft = compose(
  JSON.stringify,
  convertEmbeds,
  convertToRaw,
  stateFromMarkdown
);

const slateToDraft = compose(plainToDraft, toPlainText, toState, JSON.parse);

exports.up = function(r, conn) {
  return (
    r
      .table('threads')
      .filter(thread =>
        r.not(thread.hasFields('type')).or(thread('type').ne('DRAFTJS'))
      )
      .run(conn)
      .then(cursor => cursor.toArray())
      // Transform slate state to draftjs state
      .then(threads =>
        threads.map(thread =>
          Object.assign({}, thread, {
            type: 'DRAFTJS',
            content: Object.assign({}, thread.content, {
              body:
                thread.type === 'SLATE'
                  ? slateToDraft(thread.content.body)
                  : plainToDraft(thread.content.body),
            }),
          })
        )
      )
      // Store the transformed threads
      .then(threads =>
        Promise.all(
          threads.map(thread =>
            r
              .table('threads')
              .get(thread.id)
              .update(thread)
              .run(conn)
          )
        )
      )
  );
};

exports.down = function(r, conn) {
  // Not spending any time undoing this
  return Promise.resolve();
};
