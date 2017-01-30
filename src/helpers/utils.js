export const hashToArray = (hash) => {
  let array = []
  for (let key in hash) {
    if (!hash.hasOwnProperty(key)) continue;
    let arr = hash[key];
    array.push(arr)
  }
  return array
}