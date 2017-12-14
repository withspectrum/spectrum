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
    return searchIndex
      .saveObject(searchableUser)
      .then(() => {
        debug('stored new user in search');
        return;
      })
      .catch(err => {
        debug('error indexing a user');
        console.log(err);
      });
  });

export const deletedUser = () =>
  listenToDeletedDocumentsIn('users', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return searchIndex
      .deleteObject(data.id)
      .then(() => {
        debug('deleted user in search');
        return;
      })
      .catch(err => {
        debug('error deleting a user');
        console.log(err);
      });
  });

export const editedUser = () =>
  listenToChangedFieldIn('modifiedAt')('users', data => {
    // if we deleted the users email or username, we are deleting their account
    if (!data.username || !data.email) {
      return searchIndex
        .deleteObject(data.id)
        .then(() => {
          debug('deleted new user in search');
          return;
        })
        .catch(err => {
          debug('error deleting a user');
          console.log(err);
        });
    }

    const searchableUser = dbUserToSearchUser(data);
    return searchIndex
      .partialUpdateObject({
        objectID: data.id,
        ...searchableUser,
      })
      .then(() => {
        debug('edited user in search');
        return;
      })
      .catch(err => {
        debug('error editing a user');
        console.log(err);
      });
  });
