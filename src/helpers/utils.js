// random helpers for js and data manipulation
export const hashToArray = hash => {
  let array = [];
  for (let key in hash) {
    if (!hash.hasOwnProperty(key)) continue;
    let arr = hash[key];
    array.push(arr);
  }
  return array;
};

// e.g. arrayToHash(arr, 'id')
export const arrayToHash = (array, keyBy) => {
  let hash = {};
  array.forEach(elem => {
    hash[elem[keyBy]] = elem;
  });
  return hash;
};
