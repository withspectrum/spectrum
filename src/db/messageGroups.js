// @flow
//$FlowFixMe
import database from 'firebase/database';
//$FlowFixMe
import storage from 'firebase/storage';

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

export const uploadMediaToMessageGroup = (
  file: Object,
  messageGroupId: string,
  user: string,
) => {
  return new Promise((resolve, reject) => {
    if (!file || !messageGroupId || !user) return;
    if (file.size > 3000000) {
      reject('Please upload files smaller than 3mb 😘');
    } // if the file is larger than 3mb

    let timestamp = Date.now();
    let storageRef = storage().ref();
    let fileName = `${file.name}.${timestamp}`;
    let fileRef = storageRef.child(
      `message_groups/${messageGroupId}/${fileName}`,
    );

    // we have to story an array of media urls so that we can fetch galleries from storage
    let messageGroupRef = database()
      .ref(`message_groups/${messageGroupId}/media`)
      .push();
    let mediaKey = messageGroupRef.key;

    let updates = {};
    let mediaData = {
      fileName,
      type: file.type,
      key: mediaKey,
    };

    updates[`message_groups/${messageGroupId}/media/${mediaKey}`] = mediaData;
    database().ref().update(updates);

    // cache the image for a year
    let metaData = {
      cacheControl: `public, max-age=${60 * 60 * 24 * 365}`,
      customMetadata: {
        creator: user,
        name: file.name,
      },
    };

    fileRef.put(file, metaData).then(snapshot => {
      resolve({
        url: snapshot.downloadURL,
        meta: mediaData,
      });
    });
  });
};

export const getFileUrlFromMessageGroup = (
  filename: string,
  messageGroupId: string,
) => {
  if (!filename || !messageGroupId) return;

  return storage()
    .ref()
    .child(`/message_groups/${messageGroupId}/${filename}`)
    .getDownloadURL();
};

export const getMediaFromMessageGroup = (messageGroupId: string) =>
  new Promise(resolve => {
    const db = database();

    db
      .ref(`message_groups/${messageGroupId}/media`)
      .once('value', snapshot => resolve(snapshot.val()));
  });
