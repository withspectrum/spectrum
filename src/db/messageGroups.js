// @flow
//$FlowFixMe
import database from 'firebase/database';
//$FlowFixMe
import storage from 'firebase/storage';

export const getMessageGroup = (messageGroupId: string): Object => {
  const db = database();

  return db
    .ref(`message_groups/${messageGroupId}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

export const getMessageGroups = (uid: string): Object => {
  const db = database();

  return db
    .ref(`/users/${uid}/messageGroups`)
    .once('value')
    .then(snapshot => snapshot.val());
};

/*
 * Given a messageGroup id, return true if the messageGroup's users are exactly matching
 * the current user + checking user(s)
 *
 * Right now this works for checking 1:1 groupMessages, but in the future can easily
 * support 1:many groupMessages
 *
 */
export const checkMessageGroupForUsersMatch = (
  group: string,
  currentUser: string,
  checkingUser: string,
): string => {
  const db = database();

  return db.ref(`/message_groups/${group}`).once('value').then(snapshot => {
    const messageGroupObj = snapshot.val();
    const users = Object.keys(messageGroupObj.users);
    const toCheck = [currentUser, checkingUser];

    if (users.sort().join('') === toCheck.sort().join('')) {
      return messageGroupObj.id;
    }
  });
};

export const createNewMessageGroup = (
  sender: string,
  recipient: string,
): string => {
  const db = database();

  const messageGroupKey = db.ref('/message_groups').push().key;
  let updates = {};

  // add the new group to both sender and receiver
  updates[`users/${sender}/messageGroups/${messageGroupKey}`] = {
    id: messageGroupKey,
    last_activity: database.ServerValue.TIMESTAMP,
    last_seen: database.ServerValue.TIMESTAMP,
  };
  updates[`users/${recipient}/messageGroups/${messageGroupKey}`] = {
    id: messageGroupKey,
    last_activity: database.ServerValue.TIMESTAMP,
  };

  // create the new message_group
  updates[`message_groups/${messageGroupKey}/creator`] = sender;
  updates[`message_groups/${messageGroupKey}/id`] = messageGroupKey;
  updates[
    `message_groups/${messageGroupKey}/last_activity`
  ] = database.ServerValue.TIMESTAMP;
  updates[`message_groups/${messageGroupKey}/private`] = true;
  updates[`message_groups/${messageGroupKey}/users/${sender}`] = { id: sender };
  updates[`message_groups/${messageGroupKey}/users/${recipient}`] = {
    id: recipient,
  };

  return db.ref().update(updates).then(() => messageGroupKey);
};

export const listenToNewMessages = (uid: string, cb: Function) => {
  const db = database();

  const handle = (snapshot: Object) => {
    const messageGroups = snapshot.val();
    if (!messageGroups) return;
    return cb(messageGroups);
  };

  // Handle adding of unread messages
  db.ref(`/users/${uid}/messageGroups`).on('child_added', handle);
  // Handle changing of any messageGroups
  db.ref(`/users/${uid}/messageGroups`).on('child_changed', handle);
};

let activeMessageGroup;
export const listenToMessageGroup = (
  messageGroupId: string,
  cb: Function,
): Function => {
  const db = database();
  activeMessageGroup = messageGroupId;

  return db.ref(`message_groups/${messageGroupId}`).on('value', snapshot => {
    cb(snapshot.val());
  });
};

export const stopListening = (listener: Function) => {
  const db = database();

  return db.ref(`message_groups/${activeMessageGroup}`).off('value', listener);
};

export const setMessageGroupLastSeen = (
  uid: string,
  messageGroupId: string,
) => {
  const db = database();

  const updates = {};
  updates[
    `message_groups/${messageGroupId}/users/${uid}/last_seen`
  ] = database.ServerValue.TIMESTAMP;
  updates[
    `users/${uid}/messageGroups/${messageGroupId}/last_seen`
  ] = database.ServerValue.TIMESTAMP;

  return db.ref().update(updates);
};
