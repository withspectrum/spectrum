//@flow
//$FlowFixMe
import database from 'firebase/database';
import { getStory } from './stories';
import { getMessageGroup } from './messageGroups';
import { getActiveMessageGroupObject } from '../actions/messageGroups';
import { createNotifications } from './notifications';
import { getUserInfo } from './users';
import { ACTIVITY_TYPES } from './types';

const UNIQUE = (v, i, a) => a.indexOf(v) === i;

type MessageTypes = 'messages' | 'messages_private';
type LocationTypes = 'stories' | 'message_groups';

export const getMessageKey = (type: MessageTypes): string =>
  database().ref(type).push().key;

type GetMessageReturn = Promise<Object>;
export const getMessage = (
  type: MessageTypes,
  key: string
): GetMessageReturn => {
  const db = database();

  return db
    .ref(`${type}/${key}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

type GetMessagesFromLocationReturn = Promise<Array<Object>>;
export const getMessagesFromLocation = (
  location: LocationTypes,
  key: string
): GetMessagesFromLocationReturn => {
  const getDataFunc = location === 'stories'
    ? getStory
    : location === 'message_groups' ? getMessageGroup : getStory;

  return getDataFunc(key).then(data => {
    if (!data.messages) return Promise.resolve([]);
    const messages = Object.keys(data.messages);
    const type = location === 'stories'
      ? 'messages'
      : location === 'message_groups' ? 'messages_private' : 'messages';
    return Promise.all(messages.map(key => getMessage(type, key)));
  });

  return Promise.resolve([]);
};

type CreateMessageProps = {
  storyId: string,
  frequencyId: string,
  user: Object,
  message: {
    type: string,
    content: string,
  },
  key: ?string,
};
type CreateMessageReturn = Promise<Object>;
export const createMessage = ({
  storyId,
  frequencyId,
  user,
  message,
  key,
}: CreateMessageProps): CreateMessageReturn => {
  const db = database();
  const messageType = 'messages';
  const locationType = 'stories';
  const id = key || getMessageKey(messageType);

  return db
    .ref()
    .update({
      [`${messageType}/${id}`]: {
        id,
        storyId,
        frequencyId,
        timestamp: database.ServerValue.TIMESTAMP,
        userId: user.uid,
        message,
      },
      [`${locationType}/${storyId}/last_activity`]: database.ServerValue
        .TIMESTAMP,
      [`${locationType}/${storyId}/participants/${user.uid}`]: {
        id: user.uid,
        last_activity: database.ServerValue.TIMESTAMP,
      },
      [`${locationType}/${storyId}/messages/${id}`]: {
        id,
      },
    })
    .then(() => db.ref(`${locationType}/${storyId}`).once('value'))
    .then(snapshot => snapshot.val())
    .then(story => {
      // If this is a new story after the intro of story.participants, use that rather than
      // getting them manually
      if (story.participants) return Object.keys(story.participants);

      // If this is an old story without story.participants, get all the messages
      // and manually get all users that sent messages
      return getMessagesFromLocation(locationType, storyId).then(messages =>
        messages
          // - Everybody who's sent a message in that story before
          .map(({ userId }) => userId)
          // - Creator of story
          .concat([story.creator.uid])
          .filter(UNIQUE)
      );
    })
    .then(users =>
      createNotifications({
        // Avoid notifying the sender
        users: users.filter(uid => uid !== user.uid),
        activityType: ACTIVITY_TYPES.NEW_MESSAGE,
        ids: {
          frequency: frequencyId,
          story: storyId,
        },
        sender: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        content: message.type === 'text' ? message.content.substr(0, 140) : '',
      })
    )
    .then(() => db.ref(`${messageType}/${id}`).once('value'))
    .then(snapshot => snapshot.val());
};

type CreatePrivateMessageProps = {
  messageGroupId: string,
  userId: string,
  message: {
    type: string,
    content: string,
  },
  key: ?string,
};
type CreatePrivateMessageReturn = Promise<Object>;
export const createPrivateMessage = ({
  messageGroupId,
  userId,
  message,
  key,
}: CreatePrivateMessageProps): CreatePrivateMessageReturn => {
  const db = database();
  const messageType = 'messages_private';
  const locationType = 'message_groups';
  const id = key || getMessageKey(messageType);

  return db
    .ref()
    .update({
      [`${messageType}/${id}`]: {
        id,
        messageGroupId,
        timestamp: database.ServerValue.TIMESTAMP,
        userId,
        message,
      },
      [`${locationType}/${messageGroupId}/last_activity`]: database.ServerValue
        .TIMESTAMP,
      [`${locationType}/${messageGroupId}/users/${userId}/last_activity`]: database
        .ServerValue.TIMESTAMP,
      [`${locationType}/${messageGroupId}/messages/${id}`]: {
        id,
      },
      [`${locationType}/${messageGroupId}/snippet`]: message.type === 'text'
        ? message.content
        : 'Sent an attachment', // save a snippet of the last text message, or assume a media message
    })
    .then(() => db.ref(`${messageType}/${id}`).once('value'))
    .then(snapshot => snapshot.val());
};

export const setLastActivityOnMessageGroupParticipants = (
  messageGroup: Object
) => {
  const users = Object.keys(messageGroup.users);
  Promise.all(
    users.map(user => setLastActiveOnMessageGroupForUser(messageGroup.id, user))
  );
};

export const setLastActiveOnMessageGroupForUser = (
  messageGroup: string,
  user: string
) => {
  const db = database();
  return db.ref(`/users/${user}/messageGroups/${messageGroup}`).update({
    ['last_activity']: database.ServerValue.TIMESTAMP,
  });
};

type CreateReactionProps = {
  type: MessageTypes,
  messageId: string,
  uid: string,
};
export const createReaction = ({
  type,
  messageId,
  uid,
}: CreateReactionProps) => {
  const db = database();

  const TYPE = 'like';

  return db
    .ref()
    .update({
      [`${type}/${messageId}/reactions/${uid}`]: {
        type: TYPE,
        timestamp: database.ServerValue.TIMESTAMP,
      },
    })
    .then(() => Promise.all([getMessage(type, messageId), getUserInfo(uid)]))
    .then(([message, user]) => {
      // no notifications needed for private message reactions
      if (type === 'messages_private') return;
      createNotifications({
        users: [message.userId],
        activityType: ACTIVITY_TYPES.REACTION,
        ids: {
          frequency: message.frequencyId,
          story: message.storyId,
        },
        sender: {
          uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        content: TYPE,
      });
    });
};

type DeleteReactionProps = {
  type: MessageTypes,
  messageId: string,
  uid: string,
};
export const deleteReaction = ({
  type,
  messageId,
  uid,
}: DeleteReactionProps) => {
  const db = database();

  return db.ref(`/${type}/${messageId}/reactions/${uid}`).remove();
};
