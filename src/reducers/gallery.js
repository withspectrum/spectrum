const initialState = {
  media: null,
  isOpen: false,
};

export default function gallery(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_GALLERY':
      return {
        media: action.media,
        isOpen: true,
      };
    case 'HIDE_GALLERY':
      return initialState;
    default:
      return state;
  }
}
