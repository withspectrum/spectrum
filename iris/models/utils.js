const { db } = require('./db');

export const NEW_DOCUMENTS = db
  .row('old_val')
  .eq(null)
  .and(db.not(db.row('new_val').eq(null)));

export const listenToNewDocumentsIn = (table, cb) => {
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

const parseRange = timeframe => {
  switch (timeframe) {
    case 'daily': {
      return { current: 60 * 60 * 24, previous: 60 * 60 * 24 * 2 };
    }
    case 'weekly': {
      return { current: 60 * 60 * 24 * 7, previous: 60 * 60 * 24 * 14 };
    }
    case 'monthly': {
      return { current: 60 * 60 * 24 * 30, previous: 60 * 60 * 24 * 60 };
    }
    case 'quarterly': {
      return { current: 60 * 60 * 24 * 90, previous: 60 * 60 * 24 * 180 };
    }
    default: {
      return { current: 60 * 60 * 24 * 7, previous: 60 * 60 * 24 * 14 };
    }
  }
};

export const getAu = (range: string) => {
  const { current } = parseRange(range);
  return db
    .table('users')
    .filter(db.row('lastSeen').during(db.now().sub(current), db.now()))
    .count()
    .default(0)
    .run();
};

export const getGrowth = async (
  table: string,
  range: string,
  field: string,
  filter: ?mixed
) => {
  const { current, previous } = parseRange(range);
  const currentPeriodCount = await db
    .table(table)
    .filter(db.row(field).during(db.now().sub(current), db.now()))
    .filter(filter ? filter : '')
    .count()
    .run();

  const prevPeriodCount = await db
    .table(table)
    .filter(db.row(field).during(db.now().sub(previous), db.now().sub(current)))
    .filter(filter ? filter : '')
    .count()
    .run();

  const rate = (await (currentPeriodCount - prevPeriodCount)) / prevPeriodCount;
  return {
    currentPeriodCount,
    prevPeriodCount,
    growth: Math.round(rate * 100),
  };
};

export const getCount = (table: string, filter: mixed) => {
  if (filter) {
    return db
      .table(table)
      .filter(filter)
      .count()
      .run();
  }

  return db
    .table(table)
    .count()
    .run();
};
