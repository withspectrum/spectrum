const initialState = {
  uid: null,
  loginError: null,
  displayName: null,
  photoURL: null,
  frequencies: null,
  loaded: false,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SIGNUP_ERROR':
      return Object.assign({}, state, {
        loginError: action.message,
        loaded: true,
      });
    case 'SET_INITIAL_DATA':
    case 'SET_USER':
      return Object.assign({}, state, {
        uid: action.user.uid,
        photoURL: action.user.photoURL,
        displayName: action.user.displayName,
        frequencies: action.user.frequencies,
        loaded: true,
      });
    case 'USER_NOT_AUTHENTICATED':
      // Reset the state
      return Object.assign({}, initialState, {
        loaded: true,
      });
    default:
      return state;
  }
}
