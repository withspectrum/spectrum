import database from 'firebase/database';

export const getMessageGroup = messageGroupId => {
  const db = database();

  return db
    .ref(`message_groups/${messageGroupId}`)
    .once('value')
    .then(snapshot => snapshot.val());
};

export const createNewMessageGroup = (sender, recipient) => {
  const db = database();

  const messageGroupKey = db.ref('/message_groups').push().key;
  let updates = {};

  // add the new group to both sender and receiver
  updates[`users/${sender}/messageGroups/${messageGroupKey}`] = {
    id: messageGroupKey,
  };
  updates[`users/${recipient}/messageGroups/${messageGroupKey}`] = {
    id: messageGroupKey,
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

let activeMessageGroup;
export const listenToMessageGroup = (messageGroupId, cb) => {
  const db = database();
  activeMessageGroup = messageGroupId;

  return db.ref(`message_groups/${messageGroupId}`).on('value', snapshot => {
    cb(snapshot.val());
  });
};

export const stopListening = listener => {
  const db = database();

  return db.ref(`message_groups/${activeMessageGroup}`).off('value', listener);
};
