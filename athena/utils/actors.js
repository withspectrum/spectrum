// @flow
// takes an array of objects containing user data and returns an array with unique objects
export const getDistinctActors = (array: Array<any>): Array<any> => {
  let unique = {};
  let distinct = [];
  for (let actor of array) {
    if (typeof unique[actor.id] === 'undefined') {
      distinct.push(actor);
    }
    unique[actor.id] = 0;
  }
  return distinct;
};
