// @flow
const debug = require('debug')('vulcan:user');
const { db } = require('./db');
const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const usersSearchIndex = algolia.initIndex(IS_PROD ? 'users' : 'dev_users');
import {
  dbUserToSearchUser,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const newUser = () =>
  listenToNewDocumentsIn('users', data => {
    const searchableUser = dbUserToSearchUser(data);
    return usersSearchIndex.saveObject(searchableUser, (err, obj) => {
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
    return usersSearchIndex.deleteObject(data.id, (err, obj) => {
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
      return usersSearchIndex.deleteObject(data.id, (err, obj) => {
        if (err) {
          debug('error deleting a user after editing');
          console.log(err);
        }
        debug('deleted user in search after editing');
      });
    }

    const searchableUser = dbUserToSearchUser(data);
    return usersSearchIndex.partialUpdateObject(
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
