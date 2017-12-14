// @flow
const debug = require('debug')('vulcan:community');
import initIndex from './algolia';
const searchIndex = initIndex('communities');
import {
  dbCommunityToSearchCommunity,
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from './utils';

export const newCommunity = () =>
  listenToNewDocumentsIn('communities', data => {
    const searchableCommunity = dbCommunityToSearchCommunity(data);
    return searchIndex.saveObject(searchableCommunity, (err, obj) => {
      if (err) {
        debug('error indexing a community');
        console.log(err);
      }
      debug('stored new community in search');
    });
  });

export const deletedCommunity = () =>
  listenToDeletedDocumentsIn('communities', data => {
    // something went wrong if it hits here and doesn't have a deleted field
    if (!data.deletedAt) return;
    return searchIndex.deleteObject(data.id, (err, obj) => {
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
    return searchIndex.partialUpdateObject(
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
