// @flow
import { type AuthenticateAction } from '../actions/authentication';
export type AuthenticationState = {
  +token?: ?string,
};

const initialState: AuthenticationState = {
  token: null,
};

type Actions = AuthenticateAction;

export default (
  state: AuthenticationState = initialState,
  action: AuthenticateAction
): AuthenticationState => {
  switch (action.type) {
    case 'AUTHENTICATE': {
      return {
        ...state,
        token: action.token,
      };
    }
    case 'LOGOUT': {
      return initialState;
    }
    default:
      return state;
  }
};
