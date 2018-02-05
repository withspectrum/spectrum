// @flow

type AuthenticationState = {
  token: ?string,
  userId?: string,
};

const initialState: AuthenticationState = {
  token: null,
};

export default (state: AuthenticationState = initialState, action: Object) => {
  switch (action.type) {
    case 'AUTHENTICATE': {
      return {
        ...state,
        token: action.token,
      };
    }
    default:
      return state;
  }
};
