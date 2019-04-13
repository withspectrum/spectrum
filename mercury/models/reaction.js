// @flow
const { db } = require('shared/db');

export const getAllReactionsInThread = (
  messageIds: Array<string>
): Promise<Array<Object>> => {
  return db
    .table('reactions')
    .getAll(...messageIds, { index: 'messageId' })
    .run();
};
