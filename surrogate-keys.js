const fs = require('fs');
const data = require('./response.json');
const traverse = require('traverse');

let keys = [];

traverse(data).forEach(item => {
  if (item && item.id) keys.push(item.id);
});

console.log(keys.filter((a, i, arr) => arr.indexOf(a) === i).length);
