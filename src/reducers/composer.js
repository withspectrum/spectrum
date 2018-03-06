const initialState = {
  isOpen: false,
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_COMPOSER':
      return Object.assign({}, state, {
        isOpen: true,
      });
    case 'CLOSE_COMPOSER':
      return Object.assign({}, state, {
        isOpen: false,
      });
    default:
      return state;
  }
}
