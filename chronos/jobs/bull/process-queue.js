// @flow
var createQueue = require('./create-queue');

// A small wrapper around bull to have consistent logging
function processQueue(name /*: string*/, cb /*: Function*/) {
  console.log(`📥 Processing ${name} queue...`);
  return createQueue(name).process(cb);
}

module.exports = processQueue;
