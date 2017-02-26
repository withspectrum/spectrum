const initialState = {
  active: false,
};

export default function loading(state = initialState, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        active: true,
      };
    case 'STOP_LOADING':
    case 'SET_FREQUENCIES':
    case 'ADD_FREQUENCY':
    case 'CREATE_FREQUENCY':
    case 'EDIT_FREQUENCY':
    case 'UNSUBSCRIBE_FREQUENCY':
    case 'SET_STORIES':
    case 'CREATE_STORY':
    case 'DELETE_STORY':
    case 'TOGGLE_STORY_LOCK':
    case 'SHOW_GALLERY':
    case 'SET_MESSAGES':
    case 'SET_USER':
    case 'CHANGE_GALLERY_INDEX':
    case 'HIDE_GALLERY':
    case 'HIDE_MODAL':
    case 'DELETE_FREQUENCY':
      return {
        active: false,
      };
    default:
      return state;
  }
}
