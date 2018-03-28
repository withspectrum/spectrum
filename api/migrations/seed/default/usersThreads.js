// @flow
const constants = require('./constants');
const { DATE, MAX_ID, BRYN_ID, BRIAN_ID } = constants;

module.exports = [
  {
    id: '1',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    threadId: 'thread-1',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '2',
    createdAt: new Date(DATE + 1),
    userId: MAX_ID,
    threadId: 'thread-1',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '3',
    createdAt: new Date(DATE + 2),
    userId: BRYN_ID,
    threadId: 'thread-1',
    receiveNotifications: true,
    isParticipant: true,
  },

  {
    id: '4',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    threadId: 'thread-2',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '5',
    createdAt: new Date(DATE + 1),
    userId: MAX_ID,
    threadId: 'thread-2',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '6',
    createdAt: new Date(DATE + 2),
    userId: BRYN_ID,
    threadId: 'thread-2',
    receiveNotifications: true,
    isParticipant: true,
  },

  {
    id: '7',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    threadId: 'thread-3',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '8',
    createdAt: new Date(DATE + 1),
    userId: MAX_ID,
    threadId: 'thread-3',
    receiveNotifications: true,
    isParticipant: true,
  },
  {
    id: '9',
    createdAt: new Date(DATE + 2),
    userId: BRYN_ID,
    threadId: 'thread-3',
    receiveNotifications: true,
    isParticipant: true,
  },
];
