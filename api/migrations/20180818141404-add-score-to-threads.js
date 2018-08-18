const Queue = require('bull');

const calculateThreadScoreQueue = new Queue('calculate thread score');

exports.up = function(r, conn) {
  return r
    .table('threads')
    .map(t => t('id'))
    .distinct()
    .run(conn)
    .then(cursor => {
      return cursor.eachAsync((id, done) => {
        return calculateThreadScoreQueue
          .add({ threadId: id }, { jobId: id })
          .then(() => done());
      });
    });
};

exports.down = function(r, connection) {
  return Promise.resolve();
};
