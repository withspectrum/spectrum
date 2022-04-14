exports.up = function(r, conn) {
  /*

    We are adding a modifiedAt field on users and communities for 2 key reasons:
    1. By having a single field that changes as edits happen, it makes changefeeds
       much easier to follow because we only ever have to filter by the change
       on a single field (versus for watching for changes on many potentially-nested fields)
       like content.title or content.body. Because users and communities can have many
       different fields modified, in any random combination, it will make our lives
       easier to add a single `modifiedAt` field that we update whenever an edit occurs.
       Then, in the changefeed, we don't have to care about *what* changed, only
       that something changed, and we can handle downstream events (like re-indexing in
      search results)
    2. It's probably good practice anyways to keep track of when things are updated. Since
       we don't have a universal event stream, this is an incremental step towards having
       more complete knowledge about when things are being changed or deleted in the database,
       which thus makes it easier for us to trace down replayable events should a server
       crash. E.g. we can know that if a worker crashed, there were 10 users who updated
       their profiles during the downtime based on the `modifiedAt` field 

  */
  return Promise.all([
    r
      .table('users')
      .update({
        modifiedAt: new Date(),
      })
      .run(conn),
    r
      .table('communities')
      .update({
        modifiedAt: new Date(),
      })
      .run(conn),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([
    r
      .table('users')
      .update({
        modifiedAt: r.literal(),
      })
      .run(conn),
    r
      .table('communities')
      .update({
        modifiedAt: r.literal(),
      })
      .run(conn),
  ]);
};
