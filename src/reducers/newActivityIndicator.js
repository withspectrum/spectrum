const initialState = {
  hasNew: false,
};

export default function newActivityIndicator(state = initialState, action) {
  switch (action.type) {
    case 'HAS_NEW_ACTIVITY':
      return {
        hasNew: true,
      };
    case 'CLEAR_NEW_ACTIVITY_INDICATOR': {
      return initialState;
    }
    default:
      return state;
  }
}
