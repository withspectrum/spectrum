// @flow
const debug = require('debug')('athena:queue:reaction-notification');
import Raven from '../../shared/raven';
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getMessageById } from '../models/message';
import { getUserNotificationPermissionsInThread } from '../models/usersThreads';
import {
  storeNotification,
  updateNotification,
  checkForExistingNotification,
} from '../models/notification';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';

type JobData = {
  data: {
    reaction: {
      id: string,
      userId: string,
      messageId: string,
    },
    userId: string,
  },
};
export default async (job: JobData) => {
  const incomingReaction = job.data.reaction;
  const currentUserId = job.data.userId;

  debug(`new job for ${incomingReaction.id} by ${currentUserId}`);

  /*
		These promises are used to create or modify a notification. The order is:
		- actor
		- context
		- entity
  */
  const actor = await fetchPayload('USER', incomingReaction.userId);
  const context = await fetchPayload('MESSAGE', incomingReaction.messageId);
  const entity = await createPayload('REACTION', incomingReaction);

  // Check to see if an existing notif exists by matching the 'event' type, with the context of the notification, within a certain time period.
  const notification = await checkForExistingNotification(
    'REACTION_CREATED',
    incomingReaction.messageId
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

    // get the original message where the reaction was left
    const message = await getMessageById(updatedNotification.context.id);
    debug('get message');

    // make sure that the person who left the original message still has notification permissions in this thread. We have to check the threadtype to determine if the reaction was left in a story thread or a direct message thread
    // TODO: In the future we'll want reactions in direct message threads to trigger push notifications, but for now it introduces too much complexity so we just say false
    const hasPermission =
      message.threadType === 'story'
        ? await getUserNotificationPermissionsInThread(
            message.senderId,
            message.threadId
          )
        : false;

    debug('check permission of sender');

    if (!hasPermission) return;

    debug('mark notification as new for sender');

    // if the user is allowed to recieve notifications, update their notification
    return Promise.all([
      markUsersNotificationsAsNew(updatedNotification.id, message.senderId),
    ]).catch(err => {
      Raven.captureException(err);
      console.log(err);
    });
  } else {
    // if no notification was found that matches our bundling criteria, create a new notification
    // create the notification record
    const notification = {
      actors: [actor],
      event: 'REACTION_CREATED',
      context,
      entities: [entity],
    };
    debug('create notification in db');

    const updatedNotification = await storeNotification(notification);

    // get the original message where the reaction was left
    const message = await getMessageById(updatedNotification.context.id);
    debug('get message');

    // make sure that the person who left the original message still has notification permissions in this thread. We have to check the threadtype to determine if the reaction was left in a story thread or a direct message thread
    // TODO: In the future we'll want reactions in direct message threads to trigger push notifications, but for now it introduces too much complexity so we just say false
    const hasPermission =
      message.threadType === 'story'
        ? await getUserNotificationPermissionsInThread(
            message.senderId,
            message.threadId
          )
        : false;

    debug('check permission of sender');
    if (!hasPermission) return;

    debug('mark notification as new for sender');

    return Promise.all([
      storeUsersNotifications(updatedNotification.id, message.senderId),
    ]).catch(err => {
      Raven.captureException(err);
      console.log(err);
    });
  }
};
