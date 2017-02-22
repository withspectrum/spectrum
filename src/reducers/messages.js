const initialState = {
  messages: {},
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'SET_ALL_MESSAGES':
      return Object.assign({}, state, {
        messages: action.messages
      })
    default:
      return state;
  }
}
