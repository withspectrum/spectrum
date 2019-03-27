// @flow
const constants = require('./constants');
const { fromPlainText, toJSON } = require('../../../../shared/draft-utils');
const { DATE, MAX_ID, BRYN_ID, BRIAN_ID } = constants;

module.exports = [
  {
    id: '1',
    threadId: 'thread-1',
    content: {
      body: JSON.stringify({
        blocks: [
          {
            key: '9u8bg',
            text: 'This is the first message!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      }),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE),
  },
  {
    id: '2',
    threadId: 'thread-1',
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('This is the second message!'))
      ),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 1),
  },
  {
    id: '3',
    threadId: 'thread-1',
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('The next one is an emoji-only one :scream:'))
      ),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 2),
  },
  {
    id: '4',
    threadId: 'thread-1',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('🎉'))),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 3),
  },

  {
    id: '5',
    threadId: 'thread-2',
    content: {
      body: JSON.stringify({
        blocks: [
          {
            key: '9u8bg',
            text: 'This is the first message!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      }),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE),
  },
  {
    id: '6',
    threadId: 'thread-2',
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('This is the second message!'))
      ),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 1),
  },
  {
    id: '7',
    threadId: 'thread-2',
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('The next one is an emoji-only one :scream:'))
      ),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 2),
  },
  {
    id: '8',
    threadId: 'thread-2',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('🎉'))),
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 3),
  },

  // DM Thread
  {
    id: '9',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('Direct message thread message!'))
      ),
    },
    messageType: 'draftjs',
    senderId: MAX_ID,
    timestamp: new Date(DATE),
  },
  {
    id: '10',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A second one'))),
    },
    messageType: 'draftjs',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 50000),
  },
  {
    id: '11',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A third one'))),
    },
    messageType: 'draftjs',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 100000),
  },
  {
    id: '12',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A fourth one'))),
    },
    messageType: 'draftjs',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 200000),
  },
  {
    id: '13',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    content: {
      body: JSON.stringify(toJSON(fromPlainText('A fifth one'))),
    },
    messageType: 'draftjs',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 300000),
  },
  {
    id: '14',
    threadId: 'thread-6',
    threadType: 'story',
    content: {
      body: `{"blocks":[{"key":"7d3uf","text":"http://localhost:3000/spectrum/general/yet-another-thread~thread-9","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"type":"atomic","data":{},"text":" ","depth":0,"entityRanges":[{"offset":0,"length":1,"key":0}],"inlineStyleRanges":[],"key":"7jad1"},{"type":"unstyled","data":{},"text":" ","depth":0,"entityRanges":[],"inlineStyleRanges":[],"key":"7a0pk"}],"entityMap":{"0":{"data":{"type":"internal","id":"thread-9","entity":"thread"},"mutability":"MUTABLE","type":"embed"}}}`,
    },
    messageType: 'draftjs',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 300000),
  },
];
