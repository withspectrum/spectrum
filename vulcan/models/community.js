// @flow
const debug = require('debug')('vulcan:community');
const { db } = require('./db');
const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname, '../.env'), { raise: false });
const IS_PROD = process.env.NODE_ENV === 'production';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_SECRET = process.env.ALGOLIA_API_SECRET;
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SECRET);
const communitiesSearchIndex = algolia.initIndex(
  IS_PROD ? 'communities' : 'dev_communities'
);
import {
  dbCommunityToSearchCommunity,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const newCommunity = () =>
  listenToNewDocumentsIn('communities', data => {
    const searchableCommunity = dbCommunityToSearchCommunity(data);
    return communitiesSearchIndex.saveObject(
      searchableCommunity,
      (err, obj) => {
        if (err) {
          debug('error indexing a community');
          console.log(err);
        }
        debug('stored new community in search');
      }
    );
  });

export const deletedCommunity = () =>
  listenToDeletedDocumentsIn('communities', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return communitiesSearchIndex.deleteObject(data.id, (err, obj) => {
      if (err) {
        debug('error deleting a community');
        console.log(err);
      }
      debug('deleted community in search');
    });
  });

export const editedCommunity = () =>
  listenToChangedFieldIn('modifiedAt')('communities', data => {
    const searchableCommunity = dbCommunityToSearchCommunity(data);
    return communitiesSearchIndex.partialUpdateObject(
      {
        objectID: data.id,
        ...searchableCommunity,
      },
      (err, obj) => {
        if (err) {
          debug('error saving edited community');
          console.log(err);
        }
        debug('changed edited community content in search');
      }
    );
  });
