// @flow
import type { Dispatch } from 'redux';
import type { GlyphTypes } from '../components/Icon/types';

type ToastTypes = 'notification' | 'success' | 'error' | 'neutral';

export type AddToastType = {
  type: ToastTypes,
  message: string,
  onPressHandler?: Function,
  icon?: ?GlyphTypes,
};

export type ToastType = {
  ...$Exact<AddToastType>,
  id: number,
};

export type AddToastActionType = {
  type: 'ADD_TOAST',
  payload: {
    ...$Exact<ToastType>,
  },
};

let nextToastId = 0;
export const addToast = (payload: AddToastType) => (
  dispatch: Dispatch<Object>
) => {
  const id = nextToastId++;
  return dispatch({
    type: 'ADD_TOAST',
    payload: {
      id,
      ...payload,
    },
  });
};

export const removeToast = (id: number) => {
  return { type: 'REMOVE_TOAST', payload: { id } };
};
