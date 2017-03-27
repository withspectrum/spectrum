const initialState = {
  isOpen: false,
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
    default:
      return state;
  }
}
