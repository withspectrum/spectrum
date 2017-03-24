const initialState = {
  uid: null,
  loginError: null,
  displayName: null,
  photoURL: null,
  frequencies: {},
  loaded: false,
  plan: null,
  list: {},
};

export default function root(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SIGNUP_ERROR':
      return Object.assign({}, state, {
        loginError: action.message,
        loaded: true,
      });
    case 'UPGRADE_USER':
    case 'DOWNGRADE_USER':
    case 'SET_USER':
      return Object.assign({}, state, {
        uid: action.user.uid,
        photoURL: action.user.photoURL,
        displayName: action.user.displayName,
        frequencies: action.user.frequencies,
        email: action.user.email,
        username: action.user.username,
        plan: action.user.plan || { active: false, name: 'free' }, // to account for users without a plan field set
        loaded: true,
      });
    case 'USER_NOT_AUTHENTICATED':
      // Reset the state
      return Object.assign({}, initialState, {
        loaded: true,
      });
    case 'SUBSCRIBE_FREQUENCY':
    case 'CREATE_FREQUENCY':
      return Object.assign({}, state, {
        frequencies: {
          ...state.frequencies,
          [action.frequency.id]: {
            ...action.frequency.users[state.uid],
            id: action.frequency.id,
          },
        },
      });
    case 'UNSUBSCRIBE_FREQUENCY':
      return {
        ...state,
        frequencies: Object.keys(state.frequencies).reduce((result, key) => {
          if (key !== action.id) result[key] = state.frequencies[key];
          return result;
        }, {}),
      };
    case 'ADD_STORIES':
    case 'ADD_MESSAGES':
      return {
        ...state,
        list: {
          ...state.list,
          ...action.users,
        },
      };
    default:
      return state;
  }
}
