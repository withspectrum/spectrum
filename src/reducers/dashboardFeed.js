const initialState = {
  activeCommunity: null,
  activeThread: null,
  activeChannel: null,
  mountedWithActiveThread: null,
  search: {
    isOpen: false,
    queryString: '',
  },
};

export default function dashboardFeed(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_FEED_THREAD':
      return Object.assign({}, state, {
        activeThread: action.threadId,
      });
    case 'SELECT_FEED_COMMUNITY':
      return Object.assign({}, state, {
        activeCommunity: action.communityId,
      });
    case 'SELECT_FEED_CHANNEL':
      return Object.assign({}, state, {
        activeChannel: action.channelId,
      });
    case 'REMOVE_MOUNTED_THREAD_ID':
      return Object.assign({}, state, {
        mountedWithActiveThread: null,
      });
    case 'TOGGLE_SEARCH_OPEN': {
      return Object.assign({}, state, {
        search: {
          ...state.search,
          isOpen: action.value,
        },
      });
    }
    case 'SET_SEARCH_VALUE': {
      return Object.assign({}, state, {
        search: {
          ...state.search,
          queryString: action.value,
        },
      });
    }
    case 'SET_SEARCH_VALUE_FOR_SERVER': {
      return Object.assign({}, state, {
        search: {
          ...state.search,
          queryString: action.value,
        },
      });
    }
    default:
      return state;
  }
}
