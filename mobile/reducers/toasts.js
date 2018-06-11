// @flow
import type { ToastType, AddToastActionType } from '../actions/toasts';

const initialState = [];

export type ToastsState = Array<?ToastType>;

export default function toasts(
  state: ToastsState = initialState,
  action: AddToastActionType
) {
  switch (action.type) {
    case 'ADD_TOAST': {
      return [...state, action.payload];
    }
    case 'REMOVE_TOAST': {
      const toasts = state.filter(
        toast => toast && toast.id !== action.payload.id
      );
      return toasts;
    }
    default:
      return state;
  }
}
