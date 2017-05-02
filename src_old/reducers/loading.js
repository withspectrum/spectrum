const initialState = {
  active: false,
  stacks: 0,
};

export default function loading(state = initialState, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        active: true,
        stacks: state.stacks + 1,
      };
    case 'ADD_STORIES':
    case 'ADD_MESSAGE_GROUPS':
    case 'CHANGE_GALLERY_INDEX':
    case 'SUBSCRIBE_FREQUENCY':
    case 'CREATE_FREQUENCY':
    case 'CREATE_STORY':
    case 'DELETE_FREQUENCY':
    case 'DELETE_STORY':
    case 'EDIT_FREQUENCY':
    case 'HIDE_GALLERY':
    case 'HIDE_MODAL':
    case 'SET_FREQUENCIES':
    case 'SET_ACTIVE_MESSAGE_GROUP':
    case 'SET_MESSAGE_GROUPS':
    case 'SET_USER':
    case 'SHOW_GALLERY':
    case 'STOP_LOADING':
    case 'TOGGLE_STORY_LOCK':
    case 'UNSUBSCRIBE_FREQUENCY':
    case 'SET_NOTIFICATIONS':
    case 'SET_UPGRADE_ERROR':
      const stacks = state.stacks - 1;
      return {
        active: stacks <= 0 ? false : true,
        stacks: stacks <= 0 ? 0 : stacks,
      };
    default:
      return state;
  }
}
