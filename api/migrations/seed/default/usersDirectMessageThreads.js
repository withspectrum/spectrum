// @flow
const constants = require('./constants');
const { DATE, BRIAN_ID, MAX_ID, BRYN_ID, PREVIOUS_MEMBER_USER_ID } = constants;

module.exports = [
  {
    id: '1',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    threadId: 'dm-1',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
  {
    id: '2',
    createdAt: new Date(DATE),
    userId: BRYN_ID,
    threadId: 'dm-1',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
  {
    id: '3',
    createdAt: new Date(DATE),
    userId: MAX_ID,
    threadId: 'dm-1',
    lastActive: new Date(DATE),
    lastSeen: new Date(DATE),
    receiveNotifications: true,
  },
  {
    id: '4',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    threadId: 'dm-2',
    lastActive: new Date(DATE - 1),
    lastSeen: null,
    receiveNotifications: true,
  },
  {
    id: '5',
    createdAt: new Date(DATE),
    userId: PREVIOUS_MEMBER_USER_ID,
    threadId: 'dm-2',
    lastActive: new Date(DATE - 1),
    lastSeen: new Date(DATE - 1),
    receiveNotifications: true,
  },
];
