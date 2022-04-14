// @flow

module.exports = () => {
  let settings = [];
  for (let step = 0; step < 11; step++) {
    settings.push({
      userId: step.toString(),
      notifications: {
        types: {
          newMessageInThreads: {
            email: true,
          },
          newMention: {
            email: true,
          },
          newDirectMessage: {
            email: true,
          },
          newThreadCreated: {
            email: true,
          },
          dailyDigest: {
            email: true,
          },
          weeklyDigest: {
            email: true,
          },
        },
      },
    });
  }
  return settings;
};
