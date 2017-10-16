const initialState = {
  initNewThreadWithUser: [],
};

export default function directMessageThreads(state = initialState, action) {
  switch (action.type) {
    case 'ADD_USERS_DIRECT_MESSAGES_COMPOSER':
      return Object.assign({}, state, {
        initNewThreadWithUser: [action.payload],
      });
    case 'CLEAR_DIRECT_MESSAGES_COMPOSER':
      return initialState;
    default:
      return state;
  }
}
