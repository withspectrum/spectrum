// @flow
const debug = require('debug')('shared:changefeed-utils');
import processChangefeed from 'rethinkdb-changefeed-reconnect';
import Raven from 'shared/raven';
import type { Cursor } from 'rethinkhaberdashery';

export const newDocuments = (db: any) =>
  db
    .row('old_val')
    .eq(null)
    .and(db.not(db.row('new_val').eq(null)));

export const deletedDocuments = (db: any) =>
  db
    .row('old_val')
    .hasFields('deletedAt')
    .not()
    .and(
      db
        .row('new_val')
        .hasFields('deletedAt')
        .and(
          db
            .row('new_val')('deletedAt')
            .ne(null)
        )
    );

export const hasChangedField = (db: any, field: string) =>
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field));

export const hasNewField = (db: any, field: string) =>
  db
    .row('old_val')
    .hasFields(field)
    .not()
    .and(db.row('new_val').hasFields(field));

export const hasDeletedField = (db: any, field: string) =>
  db
    .row('old_val')
    .hasFields(field)
    .and(
      db
        .row('new_val')
        .hasFields(field)
        .not()
    );

export const createChangefeed = (
  getChangefeed: () => Promise<Cursor>,
  callback: (arg: any) => void,
  name?: string
) => {
  return processChangefeed(
    getChangefeed,
    callback,
    err => {
      console.error(err);
      Raven.captureException(err);
    },
    {
      changefeedName: name,
      attemptDelay: 10000,
      maxAttempts: Infinity,
      logger: {
        // Ignore log and info logs in production
        log: debug,
        info: debug,
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      },
    }
  );
};

export const listenToNewDocumentsIn = (
  db: any,
  table: string,
  cb: Function
) => {
  return createChangefeed(
    () =>
      db
        .table(table)
        .changes({
          includeInitial: false,
        })
        .filter(newDocuments(db))('new_val')
        .run(),
    cb,
    `listenToNewDocumentsIn(${table})`
  );
};

export const listenToDeletedDocumentsIn = (
  db: any,
  table: string,
  cb: Function
) => {
  return createChangefeed(
    () =>
      db
        .table(table)
        .changes({
          includeInitial: false,
        })
        .filter(deletedDocuments(db))('new_val')
        .run(),
    cb,
    `listenToDeletedDocumentIn(${table})`
  );
};

export const listenToChangedFieldIn = (db: any, field: string) => (
  table: string,
  cb: Function
) => {
  const CHANGED_FIELD = hasChangedField(db, field);
  return createChangefeed(
    () =>
      db
        .table(table)
        .changes({
          includeInitial: false,
        })
        .filter(CHANGED_FIELD)('new_val')
        .run(),
    cb,
    `listenToChangedFieldIn(${table}, "${field}")`
  );
};

export const listenToNewFieldIn = (db: any, field: string) => (
  table: string,
  cb: Function
) => {
  const NEW_FIELD = hasNewField(db, field);
  return createChangefeed(
    () =>
      db
        .table(table)
        .changes({
          includeInitial: false,
        })
        .filter(NEW_FIELD)('new_val')
        .run(),
    cb,
    `listenToNewFieldIn(${table}, "${field}")`
  );
};

export const listenToDeletedFieldIn = (db: any, field: string) => (
  table: string,
  cb: Function
) => {
  const DELETED_FIELD = hasDeletedField(db, field);
  return createChangefeed(
    () =>
      db
        .table(table)
        .changes({
          includeInitial: false,
        })
        .filter(DELETED_FIELD)('new_val')
        .run({ cursor: true }),
    cb,
    `listenToDeletedFieldIn(${table}, "${field}")`
  );
};
