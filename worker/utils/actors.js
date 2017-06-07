// @flow
export const getDistinctActors = array => {
  let unique = {};
  let distinct = [];
  for (let i in array) {
    if (typeof unique[array[i].id] == 'undefined') {
      distinct.push(array[i]);
    }
    unique[array[i].id] = 0;
  }
  console.log('\n8-4', distinct);
  return distinct;
};
