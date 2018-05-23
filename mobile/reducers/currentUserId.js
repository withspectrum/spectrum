// @flow
import { type SetCurrentUserAction } from '../actions/currentUserId';

export type CurrentUserState = ?string;

const initialState: CurrentUserState = null;

export default (
  state: CurrentUserState = initialState,
  action: SetCurrentUserAction
): CurrentUserState => {
  switch (action.type) {
    case 'SET_CURRENT_USER_ID': {
      return action.id;
    }
    default:
      return state;
  }
};
