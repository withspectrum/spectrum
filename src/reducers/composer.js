const initialState = {
  isOpen: false,
  title: '',
  body: '',
  newStoryKey: null,
  mediaList: [],
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_COMPOSER_OPEN':
      return Object.assign({}, state, {
        isOpen: !state.isOpen,
      });
    case 'CLOSE_COMPOSER':
      return Object.assign({}, state, {
        isOpen: false,
      });
    case 'CREATE_DRAFT':
      return Object.assign({}, state, {
        newStoryKey: action.key,
      });
    case 'CREATE_STORY':
      return Object.assign({}, state, {
        title: '',
        body: '',
        newStoryKey: null,
        isOpen: false,
      });
    case 'SET_ACTIVE_STORY':
    case 'SET_ACTIVE_FREQUENCY':
      return Object.assign({}, state, {
        isOpen: false,
      });
    case 'UPDATE_TITLE':
      return Object.assign({}, state, {
        title: action.title,
      });
    case 'UPDATE_BODY':
      return Object.assign({}, state, {
        body: action.body,
      });
    case 'ADD_MEDIA_LIST':
      return Object.assign({}, state, {
        mediaList: state.mediaList.concat(action.file),
      });
    case 'REMOVE_MEDIA_LIST': {
      const mediaList = state.mediaList
        .slice()
        .filter(file => file.meta.key !== action.key);
      return Object.assign({}, state, { mediaList });
    }
    default:
      return state;
  }
}
