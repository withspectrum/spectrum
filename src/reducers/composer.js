const initialState = {
  isOpen: false,
  title: '',
  body: '',
  newStoryKey: null
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_COMPOSER_OPEN':
      return Object.assign({}, state, {
        isOpen: !state.isOpen,
      });
    case 'CREATE_DRAFT':
      return Object.assign({}, state, {
        newStoryKey: action.newStoryKey
      })
    case 'CREATE_STORY':
      return Object.assign({}, state, {
        title: '',
        body: '',
        newStoryKey: null
      })
    case 'SET_ACTIVE_STORY':
    	return Object.assign({}, state, {
    		isOpen: false
    	});
    case 'UPDATE_TITLE':
      return Object.assign({}, state, {
        title: action.title,
      });
    case 'UPDATE_BODY':
      return Object.assign({}, state, {
        body: action.body,
      });
    default:
      return state;
  }
}
