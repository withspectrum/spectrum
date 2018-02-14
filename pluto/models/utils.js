// @flow
import { db } from './db';

export const recordExists = async (
  table: string,
  primaryIndex: string,
  filter: Object = {}
): Promise<boolean> => {
  return await db
    .table(table)
    .getAll(primaryIndex)
    .filter(filter)
    .run()
    .then(
      result =>
        console.log('Record exists: ', result) || (result && result.length > 0)
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
  return await db
    .table(table)
    .insert(record, { returnChanges: 'always' })
    .run()
    .then(
      result =>
        console.log('InsertedRecord: ', result) || result.changes[0].new_val
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
        console.log('Replaced record: ', result) ||
        result.changes[0].new_val ||
        result.changes[0].old_val
    )
    .catch(err => {
      console.log('ERROR: ', err);
      return new Error(err);
    });
};
