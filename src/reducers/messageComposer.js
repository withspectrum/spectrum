const initialState = {
  isOpen: false,
  recipient: null,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_MESSAGE_COMPOSER_OPEN':
      return Object.assign({}, state, {
        isOpen: !state.isOpen,
      });
    case 'CLOSE_MESSAGE_COMPOSER':
      return Object.assign({}, state, {
        isOpen: false,
      });
    case 'SET_MESSAGE_COMPOSER_RECIPIENT':
      return Object.assign({}, state, {
        recipient: action.recipient,
      });
    default:
      return state;
  }
}
