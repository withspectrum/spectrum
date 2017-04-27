const initialState = {
  media: null,
  index: 0,
  isOpen: false,
};

export default function gallery(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_GALLERY':
      return {
        media: action.media,
        index: action.index,
        isOpen: true,
      };
    case 'CHANGE_GALLERY_INDEX':
      return Object.assign({}, state, {
        index: action.index,
      });
    case 'HIDE_GALLERY':
      return { initialState };
    default:
      return state;
  }
}
