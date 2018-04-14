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
  listenToNewFieldIn,
  listenToDeletedFieldIn,
} from 'shared/changefeed-utils';
import { db } from './db';
import type { DBUser } from 'shared/types';

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
        console.error(err);
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
        console.error(err);
        Raven.captureException(err);
      });
  });

export const bannedUser = () =>
  listenToNewFieldIn(db, 'bannedAt')('users', (user: DBUser) => {
    debug('User banned');

    return searchIndex
      .deleteObject(user.id)
      .then(() => {
        debug('deleted user in search');
        return;
      })
      .catch(err => {
        debug('error deleting a user');
        console.error(err);
        Raven.captureException(err);
      });
  });

export const unbannedUser = () =>
  listenToDeletedFieldIn(db, 'bannedAt')('users', (user: DBUser) => {
    debug('User unbanned');

    if (user.bannedAt) {
      debug('User still has banned field, returning');
      return;
    }

    const searchableUser = dbUserToSearchUser(user);
    return searchIndex
      .saveObject(searchableUser)
      .then(() => {
        debug('stored unbanned in search');
        return;
      })
      .catch(err => {
        debug('error indexing a user');
        console.error(err);
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
          console.error(err);
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
        console.error(err);
        Raven.captureException(err);
      });
  });
