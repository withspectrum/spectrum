// @flow
export const changeActiveThread = (threadId: ?string) => {
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

export const openSearch = () => {
  return {
    type: 'TOGGLE_SEARCH_OPEN',
    value: true,
  };
};

export const closeSearch = () => {
  return {
    type: 'TOGGLE_SEARCH_OPEN',
    value: false,
  };
};

export const setSearchStringVariable = (value: string) => {
  return {
    type: 'SET_SEARCH_VALUE_FOR_SERVER',
    value,
  };
};
