// @flow
import { createReadQuery, db } from 'shared/db';
import type { DBMessage } from 'shared/types';

export const getMessageById = createReadQuery((id: string) => ({
  query: db.table('messages').get(id),
  tags: (message: ?DBMessage) => (message ? [message.id] : []),
}));
