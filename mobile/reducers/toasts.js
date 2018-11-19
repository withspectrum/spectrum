// @flow
import type {
  ToastType,
  AddToastActionType,
  RemoveToastActionType,
} from '../actions/toasts';

const initialState = [];

export type ToastsState = Array<?ToastType>;

export default function toasts(
  state: ToastsState = initialState,
  action: AddToastActionType | RemoveToastActionType
) {
  switch (action.type) {
    case 'ADD_TOAST': {
      return [...state, action.payload];
    }
    case 'REMOVE_TOAST': {
      // $FlowFixMe
      const toasts = state.filter(
        toast => toast && toast.id !== action.payload.id
      );
      return toasts;
    }
    default:
      return state;
  }
}
