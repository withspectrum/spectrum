const initialState = {
  currentUser: null,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, {
        currentUser: action.user,
      });
    default:
      return state;
  }
}
