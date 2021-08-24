// @flow
import thread from './rootThread';
import attachments from './attachments';
import channel from './channel';
import community from './community';
import participants from './participants';
import isAuthor from './isAuthor';
import isCreator from './isCreator'; // deprecated
import messageConnection from './messageConnection';
import author from './author';
import creator from './creator';
import content from './content';
import reactions from './reactions';
import metaImage from './metaImage';
import editedBy from './editedBy';

import type { DBThread } from 'shared/types';

module.exports = {
  Query: {
    thread,
  },
  Thread: {
    attachments,
    channel,
    community,
    participants,
    isAuthor,
    isCreator, // deprcated
    messageConnection,
    author,
    creator, // deprecated
    content,
    reactions,
    metaImage,
    messageCount: ({ messageCount }: DBThread) => messageCount || 0,
    editedBy,
  },
};
