// @flow
type Toasts = 'success' | 'error' | 'neutral';

const addToast = (
  id: number,
  kind: Toasts,
  message: string,
  timeout?: number
) => {
  return {
    type: 'ADD_TOAST',
    payload: {
      id,
      kind,
      message,
      timeout,
    },
  };
};

const removeToast = (id: number) => {
  return { type: 'REMOVE_TOAST', id };
};

let nextToastId = 0;
export const addToastWithTimeout = (
  kind: Toasts,
  message: string
) => dispatch => {
  const timeout = kind === 'success' ? 2000 : 4000;
  const id = nextToastId++;
  dispatch(addToast(id, kind, message, timeout));

  setTimeout(() => {
    dispatch(removeToast(id));
  }, timeout);
};
