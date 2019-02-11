// @flow
const constants = require('./constants');
const users = require('./users');

const { DATE, BRIAN_ID, PREVIOUS_MEMBER_USER_ID } = constants;

module.exports = [
  {
    actors: [
      {
        id: PREVIOUS_MEMBER_USER_ID,
        payload: JSON.stringify(
          users.find(u => u.id === PREVIOUS_MEMBER_USER_ID)
        ),
        type: 'USER',
      },
    ],
    context: {
      id: 'dm-2',
      payload: '',
      type: 'DIRECT_MESSAGE_THREAD',
    },
    createdAt: new Date(DATE + 1),
    entities: [
      {
        id: '1',
        payload: '',
        type: 'MESSAGE',
      },
    ],
    event: 'MESSAGE_CREATED',
    id: '1',
    modifiedAt: new Date(DATE + 1),
  },
];
