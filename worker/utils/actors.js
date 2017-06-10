// @flow

// takes an array of objects containing user data and returns an array with unique objects
export const getDistinctActors = array => {
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
