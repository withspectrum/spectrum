// @flow
const debug = require('debug')('vulcan:community');
import initIndex from 'shared/algolia';
import Raven from 'shared/raven';
const searchIndex = initIndex('communities');
import { dbCommunityToSearchCommunity } from './utils';
import {
  listenToNewDocumentsIn,
  listenToDeletedDocumentsIn,
  listenToChangedFieldIn,
} from 'shared/changefeed-utils';
import { db } from './db';

export const newCommunity = () =>
  listenToNewDocumentsIn(db, 'communities', data => {
    const searchableCommunity = dbCommunityToSearchCommunity(data);
    return searchIndex
      .saveObject(searchableCommunity)
      .then(() => {
        debug('stored new community in search');
        return;
      })
      .catch(err => {
        debug('error indexing a community');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const deletedCommunity = () =>
  listenToDeletedDocumentsIn(db, 'communities', data => {
    return searchIndex
      .deleteObject(data.id)
      .then(() => {
        debug('deleted community in search');
        return;
      })
      .catch(err => {
        debug('error deleting a community');
        console.log(err);
        Raven.captureException(err);
      });
  });

export const editedCommunity = () =>
  listenToChangedFieldIn(db, 'modifiedAt')('communities', data => {
    const searchableCommunity = dbCommunityToSearchCommunity(data);
    return searchIndex
      .partialUpdateObject({
        objectID: data.id,
        ...searchableCommunity,
      })
      .then(() => {
        debug('stored edited community in search');
        return;
      })
      .catch(err => {
        debug('error updating a community');
        console.log(err);
        Raven.captureException(err);
      });
  });
