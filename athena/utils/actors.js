// @flow
const debug = require('debug')('athena:actors');

// takes an array of objects containing user data and returns an array with unique objects
export const getDistinctActors = array => {
  debug('get distinct actors');
  let unique = {};
  let distinct = [];
  for (let i in array) {
    if (typeof unique[array[i].id] == 'undefined') {
      distinct.push(array[i]);
    }
    unique[array[i].id] = 0;
  }
  return distinct;
};
