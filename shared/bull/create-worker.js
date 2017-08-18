// @flow
// Create a worker with bull and start a small webserver which responds with
// health information
const http = require('http');
const Raven = require('raven');
const createQueue = require('./create-queue');

if (process.env.NODE_ENV !== 'development') {
  // Get hash of latest commit
  const commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString();

  Raven.config(
    'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
    {
      environment: process.env.NODE_ENV,
      release: commitHash,
    }
  ).install();
}

/*::
type QueueMap = {
  [name: string]: (job: any) => Promise<any>
}
*/

// Helper function to sum properties of an array of objects
// e.g. [{ completed: 6 }, { completed: 2 }] => 8
const sumArr = (
  input /*: Array<Object> */,
  prop /*: string */ /*: number */
) => {
  return input.reduce((sum, item) => sum + item[prop], 0);
};

const createWorker = (queueMap /*: QueueMap */) => {
  // Start processing the queues
  const queues = Object.keys(queueMap).map(name => {
    const queue = createQueue(name);
    queue.process(queueMap[name]);
    return queue;
  });

  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // Summarize the data across all the queues
    Promise.all(queues.map(queue => queue.getJobCounts())).then(jobCounts => {
      const data = {
        waiting: sumArr(jobCounts, 'waiting'),
        active: sumArr(jobCounts, 'active'),
        completed: sumArr(jobCounts, 'completed'),
        failed: sumArr(jobCounts, 'failed'),
        delayed: sumArr(jobCounts, 'delayed'),
      };

      res.end(JSON.stringify(data, null, 2));
    });
  });
};

module.exports = createWorker;
