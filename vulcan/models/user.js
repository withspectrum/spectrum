// @flow
const debug = require('debug')('vulcan:user');
import initIndex from './algolia';
const searchIndex = initIndex('users');
import {
  dbUserToSearchUser,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const newUser = () =>
  listenToNewDocumentsIn('users', data => {
    const searchableUser = dbUserToSearchUser(data);
    return searchIndex.saveObject(searchableUser, (err, obj) => {
      if (err) {
        debug('error indexing a user');
        console.log(err);
      }
      debug('stored new user in search');
    });
  });

export const deletedUser = () =>
  listenToDeletedDocumentsIn('users', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return searchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        debug('error deleting a user');
        console.log(err);
      }
      debug('deleted user in search');
    });
  });

export const editedUser = () =>
  listenToChangedFieldIn('modifiedAt')('users', data => {
    // if we deleted the users email or username, we are deleting their account
    if (!data.username || !data.email) {
      return searchIndex.deleteObject(data.id, (err, obj) => {
        if (err) {
          debug('error deleting a user after editing');
          console.log(err);
        }
        debug('deleted user in search after editing');
      });
    }

    const searchableUser = dbUserToSearchUser(data);
    return searchIndex.partialUpdateObject(
      {
        objectID: data.id,
        ...searchableUser,
      },
      (err, obj) => {
        if (err) {
          debug('error saving edited user');
          console.log(err);
        }
        debug('changed edited user content in search');
      }
    );
  });
