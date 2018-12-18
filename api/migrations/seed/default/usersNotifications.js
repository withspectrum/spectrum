// @flow
const constants = require('./constants');
const { DATE, BRIAN_ID } = constants;

module.exports = [
  {
    id: '1',
    notificationId: '1',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    entityAddedAt: new Date(DATE + 1),
    isRead: false,
    isSeen: false,
  },
];
