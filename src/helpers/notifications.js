import { hashToArray } from './utils';
import { ACTIVITY_TYPES } from '../db/types';

/**
 * Group incoming notifications by their id and type,
 * which allows us to show nice messages in the UI
 *
 * [{
 *   activityType: 'new-story',
 *   id: 'asdf',
 *   ids: { frequency: 'wer123' },
 *   sender: {},
 *   content: {},
 *   read: false,
 *   timestamp: 123,
 * }, {
 *   activityType: 'new-story',
 *   id: 'asdf2',
 *   ids: { frequency: 'wer123' },
 *   sender: {},
 *   content: {},
 *   read: true,
 *   timestamp: 125,
 * }]
 *
 * |
 * v
 *
 * [{
 *   activityType: 'new-story',
 *   id: 'asdf',
 *   ids: { frequency: 'wer123' },
 *   senders: [{}, {}],
 *   contentBlocks: [{}, {}],
 *   unread: 1,
 *   occurrences: 2,
 *   timestamp: 125,
 *   read: false,
 * }]
 */
export const groupNotifications = notifications => {
  if (!notifications || notifications.length === 0) return [];

  const data = {};
  notifications.forEach(notification => {
    if (
      notification.activityType !== ACTIVITY_TYPES.NEW_MESSAGE &&
      notification.activityType !== ACTIVITY_TYPES.NEW_STORY
    )
      return;
    // Group new message and story notifications by story id and activity type
    // This id will be removed in the last step
    const id = `${notification.ids.story}/${notification.activityType}`;
    if (!data[id]) {
      data[id] = notification;
      // Turn "sender" into an array of "senders"
      data[id].senders = [notification.sender];
      delete data[id].sender;
      // Turn "content" into an array of "contentBlocks"
      data[id].contentBlocks = [notification.content];
      delete data[id].content;
      // Keep track of how many times this happened
      data[id].occurrences = 1;
      data[id].unread = notification.read ? 0 : 1;
    } else {
      // Store unique senders in "senders"
      if (
        !data[id].senders.find(
          sender => sender && sender.uid === notification.sender.uid,
        )
      ) {
        data[id].senders.push(notification.sender);
      }
      // If this notification is unread, increment the unread count
      if (!notification.read) {
        data[id].unread += 1;
      }
      // Increment the occurrences and set the timestamp to the last time it happened
      data[id].occurrences += 1;

      data[id].timestamp = notification.timestamp;
      // If the notification read status is set to false, keep it at false
      // otherwise take the current notifications status
      data[id].read = data[id].read === false ? false : notification.read;
      // Add the content to "contentBlocks"
      data[id].contentBlocks.push(notification.content);
    }
  });

  // Convert that back into an array
  return hashToArray(data).sort((a, b) => b.timestamp - a.timestamp);
};

export const formatSenders = senders => {
  if (senders.length === 1) return senders[0].displayName;
  return `${senders[senders.length - 1].displayName} and ${senders.length -
    1} others`;
};
