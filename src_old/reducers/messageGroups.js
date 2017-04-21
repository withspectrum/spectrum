const initialState = {
  messageGroups: [],
  active: null,
  loaded: false,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'SET_MESSAGE_GROUPS':
      return Object.assign({}, state, {
        messageGroups: action.messageGroups,
        loaded: true,
      });
    case 'ADD_MESSAGE_GROUP': {
      // filter out the messageGroup that is being updated, then concat the state with the latest data
      const messageGroups = state.messageGroups.filter(
        group => group.id !== action.messageGroup.id
      );
      return Object.assign({}, state, {
        messageGroups: messageGroups.concat(action.messageGroup),
      });
    }
    case 'SET_ACTIVE_STORY':
    case 'CLEAR_ACTIVE_MESSAGE_GROUP':
      return Object.assign({}, state, {
        active: null,
      });
    case 'SET_ACTIVE_MESSAGE_GROUP':
      return Object.assign({}, state, {
        active: action.messageGroupId || null,
      });
    default:
      return state;
  }
}
