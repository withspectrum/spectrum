// @flow
export const changeActiveThread = (threadId: string) => {
  return {
    type: 'SELECT_FEED_THREAD',
    threadId,
  };
};

export const changeActiveCommunity = (communityId: string) => {
  return {
    type: 'SELECT_FEED_COMMUNITY',
    communityId,
  };
};

export const changeActiveChannel = (channelId: string) => {
  return {
    type: 'SELECT_FEED_CHANNEL',
    channelId,
  };
};

export const toggleComposer = () => {
  return {
    type: 'TOGGLE_COMPOSER',
  };
};
