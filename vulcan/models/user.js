// @flow
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
        console.log('error indexing a user', err);
      }
      console.log('stored new user in search', obj.objectID);
    });
  });

export const deletedUser = () =>
  listenToDeletedDocumentsIn('users', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return usersSearchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        console.log('error deleting a user', err);
      }
      console.log('deleted user in search', obj.objectID);
    });
  });

export const editedUser = () =>
  listenToChangedFieldIn('modifiedAt')('users', data => {
    // if we deleted the users email or username, we are deleting their account
    if (!data.username || !data.email) {
      return usersSearchIndex.deleteObject(data.id, (err, obj) => {
        if (err) {
          console.log('error deleting a user after editing', err);
        }
        console.log('deleted user in search after editing', obj.objectID);
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
          console.log('error saving edited user', err);
        }
        console.log('changed edited user content in search', obj.objectID);
      }
    );
  });
