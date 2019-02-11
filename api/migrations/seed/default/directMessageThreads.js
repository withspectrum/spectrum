// @flow
const constants = require('./constants');
const { DATE } = constants;

module.exports = [
  {
    id: 'dm-1',
    createdAt: new Date(DATE),
    name: null,
    threadLastActive: new Date(DATE),
  },
  {
    id: 'dm-2',
    createdAt: new Date(DATE - 1),
    name: null,
    threadLastActive: new Date(DATE - 1),
  },
];
