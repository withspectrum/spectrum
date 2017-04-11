const initialState = {
  viewing: 'stories',
  upgradeError: null,
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_FREQUENCY_NAV':
      return {
        viewing: 'frequencies',
      };
    case 'SHOW_STORIES_NAV':
    case 'CLOSE_COMPOSER':
    case 'CLEAR_ACTIVE_STORY':
    case 'DELETE_STORY':
    case 'CLOSE_FREQUENCY_NAV':
    case 'ADD_STORIES':
      return {
        viewing: 'stories',
      };
    case 'TOGGLE_COMPOSER_OPEN':
    case 'SET_ACTIVE_STORY':
      return {
        viewing: 'detail',
      };
    case 'SET_ACTIVE_MESSAGE_GROUP':
      return {
        viewing: 'messageGroup',
      };
    case 'SET_UPGRADE_ERROR':
      return {
        ...state,
        upgradeError: action.error,
      };
    default:
      return state;
  }
}
