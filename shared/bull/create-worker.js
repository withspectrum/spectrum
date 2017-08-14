// @flow
// Create a worker with bull and start a small webserver which responds with
// health information
const http = require('http');
const createQueue = require('./create-queue');

/*::
type QueueMap = {
  [name: string]: (job: any) => Promise<any>
}
*/

// Helper function to sum properties of an array of objects
// e.g. [{ completed: 6 }, { completed: 2 }] => 8
const sumArr = (
  input /*: Array<Object> */,
  prop /*: number */ /*: string */
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
