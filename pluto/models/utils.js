// @flow
import { db } from './db';

export const recordExists = (
  table: string,
  primaryIndex: string,
  filter: Object = {}
): Promise<boolean> => {
  return db
    .table(table)
    .getAll(primaryIndex)
    .filter(filter)
    .run()
    .then(result => result && result.length > 0)
    .catch(err => new Error(err));
};

export const insertRecord = (table: string, record: Object): Promise<any> => {
  return db
    .table(table)
    .insert(record, { returnChanges: 'always' })
    .run()
    .then(result => result.changes[0].new_val)
    .catch(err => new Error(err));
};

export const replaceRecord = (
  table: string,
  primaryIndex: string,
  record: Object,
  filter: Object = {}
): Promise<any> => {
  return db
    .table(table)
    .getAll(primaryIndex)
    .filter(filter)
    .replace(record, { returnChanges: 'always' })
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val)
    .catch(err => new Error(err));
};
