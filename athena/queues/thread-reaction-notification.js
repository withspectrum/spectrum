// @flow
const debug = require('debug')('athena:queue:reaction-notification');
import Raven from '../../shared/raven';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getThreadById } from '../models/thread';
import { getUserNotificationPermissionsInThread } from '../models/usersThreads';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from 'shared/db/queries/usersNotifications';
import type { Job, ThreadReactionNotificationJobData } from 'shared/bull/types';

export default async (job: Job<ThreadReactionNotificationJobData>) => {
  const incomingReaction = job.data.threadReaction;
  const currentUserId = job.data.userId;

  debug(`new job for ${incomingReaction.id} by ${currentUserId}`);

  /*
		These promises are used to create or modify a notification. The order is:
		- actor
		- context
		- entity
  */
  const actor = await fetchPayload('USER', incomingReaction.userId);
  const context = await fetchPayload('THREAD', incomingReaction.threadId);
  const entity = await createPayload('THREAD_REACTION', incomingReaction);

  // Check to see if an existing notif exists by matching the 'event' type, with the context of the notification, within a certain time period.
  const notification = await checkForExistingNotification(
    'THREAD_REACTION_CREATED',
    incomingReaction.threadId
  );

  if (notification) {
    // if an existing notification exists, update it with the newest actor + entities
    debug('found existing notification');

    // actors should always be distinct to make client side rendering easier
    const distinctActors = getDistinctActors([...notification.actors, actor]);

    // create a new notification
    const newNotification = Object.assign({}, notification, {
      actors: [...distinctActors],
      context,
      entities: [...notification.entities, entity],
    });

    debug('update existing notification in database with new data');

    // update the notification in the db
    const updatedNotification = await updateNotification(newNotification);

    // get the original thread where the reaction was left
    const thread = await getThreadById(updatedNotification.context.id);

    const hasPermission = await getUserNotificationPermissionsInThread(
      thread.creatorId,
      thread.id
    );

    debug('check permission of sender');

    if (!hasPermission) return;

    debug('mark notification as new for sender');

    // if the user is allowed to receive notifications, update their notification
    return Promise.all([
      markUsersNotificationsAsNew(updatedNotification.id, thread.creatorId),
    ]).catch(err => {
      console.error(err);
      Raven.captureException(err);
    });
  } else {
    // if no notification was found that matches our bundling criteria, create a new notification
    // create the notification record
    const notification = {
      actors: [actor],
      event: 'THREAD_REACTION_CREATED',
      context,
      entities: [entity],
    };
    debug('create notification in db');

    const updatedNotification = await storeNotification(notification);

    // get the original thread where the reaction was left
    const thread = await getThreadById(updatedNotification.context.id);
    debug('get thread');

    const hasPermission = await getUserNotificationPermissionsInThread(
      thread.creatorId,
      thread.id
    );

    debug('check permission of sender');
    if (!hasPermission) return;

    debug('mark notification as new for sender');

    return Promise.all([
      storeUsersNotifications(updatedNotification.id, thread.creatorId),
    ]).catch(err => {
      console.error('❌ Error in job:\n');
      console.error(err);
      Raven.captureException(err);
    });
  }
};
