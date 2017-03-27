import database from 'firebase/database';

export const getMessageGroup = messageGroupId => {
  const db = database();

  return db
    .ref(`message_groups/${messageGroupId}`)
    .once('value')
    .then(snapshot => snapshot.val());
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
