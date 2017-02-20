const initialState = {
  uid: null,
  loginError: null,
  displayName: null,
  photoURL: null,
  frequencies: null,
  notregistered: null,
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SIGNUP_ERROR':
      return Object.assign({}, state, {
        loginError: action.message,
      });
    case 'SET_USER':
      return Object.assign({}, state, {
        uid: action.user.uid,
        photoURL: action.user.photoURL,
        displayName: action.user.displayName,
        frequencies: action.user.frequencies,
        notregistered: false,
      });
    case 'SHOW_MARKETING_PAGE':
      return Object.assign({}, state, {
        notregistered: true,
      });
    default:
      return state;
  }
}
