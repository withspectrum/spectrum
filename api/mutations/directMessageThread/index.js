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
import archiveDirectMessageThread from './archiveDirectMessageThread';
import unarchiveDirectMessageThread from './unarchiveDirectMessageThread';
import leaveDirectMessageThread from './leaveDirectMessageThread';
import muteDirectMessageThread from './muteDirectMessageThread';
import unmuteDirectMessageThread from './unmuteDirectMessageThread';
import deleteDirectMessageThread from './deleteDirectMessageThread';

module.exports = {
  Mutation: {
    createDirectMessageThread,
    setLastSeen,
    archiveDirectMessageThread,
    unarchiveDirectMessageThread,
    leaveDirectMessageThread,
    muteDirectMessageThread,
    unmuteDirectMessageThread,
    deleteDirectMessageThread,
  },
};
