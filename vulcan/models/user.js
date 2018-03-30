// @flow
const debug = require('debug')('vulcan:user');
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
const searchIndex = initIndex('users');
import { dbUserToSearchUser } from './utils';
import {
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from 'shared/changefeed-utils';
import { db } from './db';

export const newUser = () =>
  listenToNewDocumentsIn(db, 'users', data => {
    // dont save any user without a username - they can't be linked to!
    if (!data.username) {
      debug('new user without a username, returning');
      return;
    }
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
        Raven.captureException(err);
      });
  });

export const deletedUser = () =>
  listenToDeletedDocumentsIn(db, 'users', data => {
    return searchIndex
      .deleteObject(data.id)
      .then(() => {
        debug('deleted user in search');
        return;
      })
      .catch(err => {
        debug('error deleting a user');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const editedUser = () =>
  listenToChangedFieldIn(db, 'modifiedAt')('users', data => {
    // if we deleted the users email or username, we are deleting their account
    if (!data.username) {
      return searchIndex
        .deleteObject(data.id)
        .then(() => {
          debug('deleted user in search');
          return;
        })
        .catch(err => {
          debug('error deleting a user');
          console.log(err);
          Raven.captureException(err);
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
        Raven.captureException(err);
      });
  });
