// @flow
import type { Dispatch } from 'redux';
import type { GlyphTypes } from '../components/Icon/types';

type ToastTypes = 'notification' | 'success' | 'error' | 'neutral';

export type AddToastType = {
  id: number,
  type: ToastTypes,
  message: string,
  onPressHandler: Function,
  timeout?: number,
  icon?: ?GlyphTypes,
};

const addToast = (payload: AddToastType) => {
  return {
    type: 'ADD_TOAST',
    payload,
  };
};

export const removeToast = (id: number) => {
  console.log('removing toast', id);
  return { type: 'REMOVE_TOAST', id };
};

type AddToastWithTimeoutType = {
  type: ToastTypes,
  message: string,
  onPressHandler: Function,
  icon?: GlyphTypes,
};

let nextToastId = 0;
export const addToastWithTimeout = (input: AddToastWithTimeoutType) => (
  dispatch: Dispatch<Object>
) => {
  const timeout = input.type === 'success' ? 2000 : 4000;
  const id = nextToastId++;

  dispatch(addToast({ id, timeout, ...input }));

  // setTimeout(() => {
  //   dispatch(removeToast(id));
  // }, timeout);
};
