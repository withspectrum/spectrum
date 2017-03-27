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
    case 'UPDATE_MESSAGE_GROUP':
      return Object.assign({}, state, {
        messageGroups: state.messageGroups.map(messageGroup => {
          if (messageGroup.id !== action.messageGroupId.id) return messageGroup;

          return action.messageGroupId;
        }),
      });
    case 'SET_ACTIVE_MESSAGE_GROUP':
      return Object.assign({}, state, {
        active: action.messageGroupId,
      });
    case 'CLEAR_ACTIVE_MESSAGE_GROUP':
      return Object.assign({}, state, {
        active: null,
      });
    default:
      return state;
  }
}
