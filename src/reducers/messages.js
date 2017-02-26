const initialState = {
  messages: [],
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      console.log('adding a message');
      return Object.assign({}, state, {
        messages: state.messages.concat([action.message]),
      });
    case 'SET_ALL_MESSAGES':
      return Object.assign({}, state, {
        messages: action.messages,
      });
    case 'CLEAR_MESSAGES':
      return initialState;
    default:
      return state;
  }
}
