const { db } = require('./db');

const NEW_DOCUMENTS = db
  .row('old_val')
  .eq(null)
  .and(db.not(db.row('new_val').eq(null)));

const listenToNewDocumentsIn = (table, cb) => {
  return (
    db
      .table(table)
      .changes({
        includeInitial: false,
      })
      // Filter to only include newly inserted messages in the changefeed
      .filter(NEW_DOCUMENTS)
      .run({ cursor: true }, (err, cursor) => {
        if (err) throw err;
        cursor.each((err, data) => {
          if (err) throw err;
          // Call the passed callback with the message directly
          cb(data.new_val);
        });
      })
  );
};

const getGrowth = (table: string, field?: string = 'createdAt') => {
  return db.table(table).withFields(field).run();
};

module.exports = {
  NEW_DOCUMENTS,
  listenToNewDocumentsIn,
  getGrowth,
};
