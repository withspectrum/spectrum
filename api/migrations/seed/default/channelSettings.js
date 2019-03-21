const constants = require('./constants');
const { SPECTRUM_PRIVATE_CHANNEL_ID } = constants;

module.exports = [
  {
    id: 1,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
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
