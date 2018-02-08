// @flow
import db from './db';

export const saveSource = (source: Object) => {
  return db
    .getAll(source.customerId)
    .filter({ sourceId: source.sourceId })
    .replace(source)
    .run();
};
