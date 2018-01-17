// @flow

// type DMThreadInput = {
//   participants: Array<string>,
//   message: {
//     messageType: 'text' | 'media',
//     threadType: 'directMessageThread',
//     content: {
//       body: string,
//     },
//     file: any,
//   },
// };

import createDirectMessageThread from './createDirectMessageThread';
import setLastSeen from './setLastSeen';

module.exports = {
  Mutation: {
    createDirectMessageThread,
    setLastSeen,
  },
};
