// @flow
import qs from 'query-string';
import { storeItem } from 'src/helpers/localStorage';
import { LAST_ACTIVE_COMMUNITY_KEY } from 'src/views/dashboard/components/communityList';
import { history } from 'src/helpers/history';

export const changeActiveThread = (threadId: ?string) => {
  let search = qs.parse(history.location.search);
  search.t = threadId;
  history.push({
    ...history.location,
    search: qs.stringify(search),
  });
  return {
    type: 'SELECT_FEED_THREAD',
    threadId,
  };
};

export const changeActiveCommunity = (communityId: string) => {
  storeItem(LAST_ACTIVE_COMMUNITY_KEY, communityId);
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
