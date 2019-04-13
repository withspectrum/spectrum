// @flow
const constants = require('./constants');
const { DATE, MAX_ID } = constants;

module.exports = [
  {
    id: '1',
    messageId: '4',
    type: 'like',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 4),
  },
];
