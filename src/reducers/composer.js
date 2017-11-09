const initialState = {
  isOpen: false,
  title: null,
  body: null,
  chatInput: null,
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_COMPOSER':
      return Object.assign(
        {},
        {
          ...state,
          isOpen: true,
        }
      );
    case 'CLOSE_COMPOSER':
      return Object.assign(
        {},
        {
          ...state,
          isOpen: false,
          title: action.title,
          body: action.body,
        }
      );
    case 'CLEAR_CHAT_INPUT':
      return Object.assign(
        {},
        {
          ...state,
          chatInput: null,
        }
      );
    case 'CLOSE_CHAT_INPUT':
      return Object.assign(
        {},
        {
          ...state,
          chatInput: action.payload,
        }
      );
    default:
      return state;
  }
}
