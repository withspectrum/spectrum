// @flow
const debug = require('debug')('chronos:queue:remove-seen-usersNotifications');
import Raven from 'shared/raven';
import type { DBUsersNotifications } from 'shared/types';
import {
  getSeenUsersNotifications,
  deleteUsersNotifications,
} from 'chronos/models/usersNotifications';

const processJob = async () => {
  let after = 0;
  let limit = 10000;
  let done = false;

  const processDeleteRecords = async (arr: Array<DBUsersNotifications>) => {
    if (!arr || arr.length === 0) return;

    debug('Process delete records');

    const filteredIds = arr
      .filter(rec => rec.isSeen)
      .filter(rec => {
        const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30; //ms
        const added = new Date(rec.entityAddedAt).getTime(); //ms
        const now = new Date().getTime(); //ms
        return now - added > THIRTY_DAYS;
      })
      .map(rec => rec.id)
      .filter(Boolean);

    debug(`Removing ${filteredIds.length} usersNotifications`);

    return await deleteUsersNotifications(filteredIds);
  };

  const processUsersNotificiations = async (
    arr: Array<DBUsersNotifications>
  ) => {
    if (done) {
      return await processDeleteRecords(arr);
    }

    if (arr.length < limit) {
      done = true;
      return await processDeleteRecords(arr);
    }

    return processDeleteRecords(arr).then(async () => {
      after = after + limit;
      const nextRecords = await getSeenUsersNotifications(after, limit);
      debug('Next loop');
      return processUsersNotificiations(nextRecords);
    });
  };

  debug('Initing job');

  const initialRecords = await getSeenUsersNotifications(after, limit);
  return processUsersNotificiations(initialRecords);
};

export default async () => {
  try {
    await processJob();
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
