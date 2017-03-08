import { hashToArray } from './utils';

/**
 * Group incoming notifications by their objectId and type,
 * which allows us to show nice messages in the UI
 */
export const groupNotifications = notifications => {
  if (!notifications || notifications.length === 0) return [];

  const data = {};
  notifications.forEach(notification => {
    // Group notifications by "objectId"
    if (!data[notification.objectId]) {
      data[notification.objectId] = notification;
      // Turn "sender" into an array of "senders"
      data[notification.objectId].senders = [notification.sender];
      delete data[notification.objectId].sender;
      // Turn "content" into an array of "contentBlocks"
      data[notification.objectId].contentBlocks = [notification.content];
      delete data[notification.objectId].content;
      // Keep track of how many times this happened
      data[notification.objectId].occurrences = 1;
    } else {
      // Store unique senders in "senders"
      if (
        !data[notification.objectId].senders.find(
          sender => sender.uid === notification.sender.uid,
        )
      ) {
        data[notification.objectId].senders.push(notification.sender);
      }
      // Increment the occurrences and set the timestamp to the last time it happened
      data[notification.objectId].occurrences += 1;
      data[notification.objectId].timestamp = notification.timestamp;
      // Add the content to "contentBlocks"
      data[notification.objectId].contentBlocks.push(notification.content);
    }
  });

  // Convert that back into an array
  return hashToArray(data);
};

export const formatSenders = senders => {
  if (senders.length === 1) return senders[0].displayName;
  return `${senders[senders.length - 1].displayName} and ${senders.length -
    1} others`;
};
