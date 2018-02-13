// @flow
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

export const listenToNewDocumentsIn = (
  db: any,
  table: string,
  cb: Function
) => {
  return db
    .table(table)
    .changes({
      includeInitial: false,
    })
    .filter(newDocuments(db))
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the new data
        cb(data.new_val);
      });
    });
};

export const listenToDeletedDocumentsIn = (
  db: any,
  table: string,
  cb: Function
) => {
  return db
    .table(table)
    .changes({
      includeInitial: false,
    })
    .filter(deletedDocuments(db))
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the new data
        cb(data.new_val);
      });
    });
};

export const listenToChangedFieldIn = (db: any, field: string) => (
  table: string,
  cb: Function
) => {
  const CHANGED_FIELD = hasChangedField(db, field);
  return db
    .table(table)
    .changes({
      includeInitial: false,
    })
    .filter(CHANGED_FIELD)
    .run({ cursor: true }, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, data) => {
        if (err) throw err;
        // Call the passed callback with the new data
        cb(data.new_val);
      });
    });
};
