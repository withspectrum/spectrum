const constants = require('./constants');
const { PAYMENTS_PRIVATE_CHANNEL_ID } = constants;

module.exports = [
  {
    id: 1,
    channelId: PAYMENTS_PRIVATE_CHANNEL_ID,
    joinSettings: {
      tokenJoinEnabled: true,
      token: 'abc',
    },
    slackSettings: {
      botLinks: {
        threadCreated: null,
      },
    },
  },
];
