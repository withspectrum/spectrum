const initialState = {
  activeCommunity: null,
  activeThread: null,
  activeChannel: null,
  mountedWithActiveThread: null,
};

export default function dashboardFeed(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_FEED_THREAD':
      return Object.assign({}, ...state, {
        ...state,
        activeThread: action.threadId,
      });
    case 'SELECT_FEED_COMMUNITY':
      return Object.assign({}, ...state, {
        ...state,
        activeCommunity: action.communityId,
      });
    case 'SELECT_FEED_CHANNEL':
      return Object.assign({}, ...state, {
        ...state,
        activeChannel: action.channelId,
      });
    case 'REMOVE_MOUNTED_THREAD_ID':
      return Object.assign({}, ...state, {
        ...state,
        mountedWithActiveThread: null,
      });
    default:
      return state;
  }
}
