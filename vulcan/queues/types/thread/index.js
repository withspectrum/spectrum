// @flow
import created from '../../events/created';
import edited from '../../events/edited';
import deleted from '../../events/deleted';
import moved from './moved';
import { getThreadById } from 'shared/db/queries/thread';
import { dbThreadToSearchThread } from '../../../utils';

export default {
  created,
  edited,
  deleted,
  moved,
  get: getThreadById,
  transform: dbThreadToSearchThread,
  index: 'threads_and_messages',
};
