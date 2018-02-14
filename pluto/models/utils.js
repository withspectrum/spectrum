// @flow
import { db } from './db';
const debug = require('debug')('pluto:models:utils');

export const recordExists = async (
  table: string,
  primaryIndex: string,
  filter: Object = {}
): Promise<boolean> => {
  debug(`Checking for duplicate records ${primaryIndex}`);
  return await db
    .table(table)
    .getAll(primaryIndex)
    .filter(filter)
    .run()
    .then(
      result =>
        debug(`\nRecord exists for ${primaryIndex}`) ||
        console.log(result) ||
        (result && result.length > 0)
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};

export const insertRecord = async (
  table: string,
  record: Object
): Promise<any> => {
  debug(`Inserting ${record.id}`);
  return await db
    .table(table)
    .insert(record, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        debug('\nInserted') || console.log(result) || result.changes[0].new_val
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};

export const replaceRecord = async (
  table: string,
  primaryIndex: string,
  record: Object,
  filter: Object = {}
): Promise<any> => {
  return await db
    .table(table)
    .getAll(primaryIndex)
    .filter(filter)
    .replace(record, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        debug('\nReplaced') ||
        console.log(result) ||
        result.changes[0].new_val ||
        result.changes[0].old_val
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};
