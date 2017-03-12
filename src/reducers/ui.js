const initialState = {
  viewing: 'stories',
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
      return {
        viewing: 'stories',
      };
    case 'TOGGLE_COMPOSER_OPEN':
      return {
        viewing: 'detail',
      };
    default:
      return state;
  }
}
