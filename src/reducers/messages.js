const initialState = {
  messages: {},
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      return Object.assign({}, state, {
        messages: {
          ...state.messages,
          [action.story]: action.messages,
        },
      });
    default:
      return state;
  }
}
