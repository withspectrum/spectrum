// @flow
import { created } from 'vulcan/queues/events/created';
import { edited } from 'vulcan/queues/events/edited';
import { deleted } from 'vulcan/queues/events/deleted';
import { moved } from 'vulcan/queues/types/thread/moved';
import { getThreadById } from 'shared/db/queries/thread';
import { dbThreadToSearchThread } from 'vulcan/utils';

export const threadType = {
  created,
  edited,
  deleted,
  moved,
  get: getThreadById,
  transform: dbThreadToSearchThread,
  index: 'threads_and_messages',
};
