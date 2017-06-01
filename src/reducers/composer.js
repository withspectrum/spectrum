const initialState = {
  isOpen: false,
  title: null,
  body: null,
};

export default function modal(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_COMPOSER':
      return {
        isOpen: true,
      };
    case 'CLOSE_COMPOSER':
      return {
        isOpen: false,
        title: action.title,
        body: action.body,
      };
    default:
      return state;
  }
}
