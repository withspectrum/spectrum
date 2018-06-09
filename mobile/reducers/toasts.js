// @flow
import type { AddToastType } from '../actions/toasts';

const initialState = [];

export type ToastsState = Array<?AddToastType>;

export default function toasts(
  state: ToastsState = initialState,
  action: AddToastType
) {
  switch (action.type) {
    case 'ADD_TOAST': {
      return [...state, action.payload];
    }
    case 'REMOVE_TOAST': {
      const toasts = state.filter(toast => toast && toast.id !== action.id);
      return toasts;
    }
    default:
      return state;
  }
}
