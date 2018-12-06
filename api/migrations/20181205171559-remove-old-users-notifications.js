exports.up = async (r, conn) => {
  let after = 0;
  let limit = 10000;
  let done = false;

  const getRecords = async (after, limit) => {
    return await r
      .table('usersNotifications')
      .skip(after)
      .limit(limit)
      .run(conn)
      .then(cursor => cursor.toArray());
  };

  const deleteRecords = async arr => {
    if (!arr || arr.length === 0) return;

    const filtered = arr
      .filter(rec => rec.isSeen)
      .filter(rec => {
        const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30; //ms
        const added = new Date(rec.entityAddedAt).getTime(); //ms
        const now = new Date().getTime(); //ms
        return now - added > THIRTY_DAYS;
      })
      .map(rec => rec.id)
      .filter(Boolean);

    return await r
      .table('usersNotifications')
      .getAll(...filtered)
      .delete()
      .run(conn);
  };

  const processUsersNotificiations = async arr => {
    if (done) {
      return await deleteRecords(arr);
    }

    if (arr.length < limit) {
      done = true;
      return await deleteRecords(arr);
    }

    return deleteRecords(arr).then(async () => {
      after = after + limit;
      const nextRecords = await getRecords(after, limit);

      return processUsersNotificiations(nextRecords);
    });
  };

  const initialRecordIds = await getRecords(after, limit);

  return processUsersNotificiations(initialRecordIds);
};

exports.down = function(r, conn) {
  return Promise.resolve();
};
