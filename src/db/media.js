// @flow
//$FlowFixMe
import database from 'firebase/database';
//$FlowFixMe
import storage from 'firebase/storage';
import { hashToArray } from '../helpers/utils';

type LocationType = 'message_groups' | 'stories' | 'users';

type UploadMediaReturn = Promise<Object>;
export const uploadMediaToLocation = (
  file: {
    size: number,
    name: string,
    type: string,
  },
  location: LocationType,
  key: string,
  userId: string
): UploadMediaReturn => {
  return new Promise((resolve, reject) => {
    if (!file || !location || !key || !userId) return;

    if (file.size > 3000000) {
      return reject('Please upload files smaller than 3mb 😘');
    }

    // handle duplicate filenames
    const timestamp = Date.now();
    const fileName = `${file.name}.${timestamp}`;

    // e.g. storage/stories/$storyId/$fileName => object
    const storageRef = storage().ref().child(`${location}/${key}/${fileName}`);

    // also store the media object in the databse
    // e.g. database/stories/$storyId/$fileName => object
    const locationRef = database().ref(`${location}/${key}/media`).push();
    const mediaKey = locationRef.key;

    // store metadata in the database to easily check user and filetypes on the client
    const databaseMetadata = {
      fileName,
      type: file.type,
      key: mediaKey,
      creator: userId,
    };

    console.log(databaseMetadata);

    const updates = {};
    // update the database ref
    updates[`${location}/${key}/media/${mediaKey}`] = databaseMetadata;
    database().ref().update(updates);

    // cache the image for a year
    const storageMetaData = {
      cacheControl: `public, max-age=${60 * 60 * 24 * 365}`,
      customMetadata: {
        creator: userId,
        name: file.name,
      },
    };

    storageRef.put(file, storageMetaData).then(snapshot => {
      // only resolve when everything is done and storage save is complete
      resolve({
        url: snapshot.downloadURL,
        meta: databaseMetadata,
      });
    });
  });
};

type uploadMultipleMediaToLocationReturn = Promise<Array<Object>>;
export const uploadMultipleMediaToLocation = (
  files: Object,
  location: LocationType,
  key: string,
  userId: string
): uploadMultipleMediaToLocationReturn => {
  let filesArr = hashToArray(files);
  return Promise.all(
    filesArr.map(file => uploadMediaToLocation(file, location, key, userId))
  );
};

type GetFileUrlFromLocationReturn = Promise<any>;
export const getFileUrlFromLocation = (
  fileName: string,
  location: LocationType,
  key: string
): GetFileUrlFromLocationReturn => {
  if (!fileName || !location || !key) {
    return new Promise.resolve('Could not get file from location.');
  }

  return storage()
    .ref()
    .child(`/${location}/${key}/${fileName}`)
    .getDownloadURL();
};

type GetMediaFromLocationReturn = Promise<Object>;
export const getMediaFromLocation = (
  location: LocationType,
  key: string
): GetMediaFromLocationReturn =>
  new Promise(resolve => {
    const db = database();

    db
      .ref(`${location}/${key}/media`)
      .once('value', snapshot => resolve(snapshot.val()));
  });
