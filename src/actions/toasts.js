// @flow
type Toasts = 'success' | 'error' | 'neutral';

type Action = 'refresh';

export const addToast = (
  id: number,
  kind: Toasts,
  message: string,
  action?: Action
) => {
  return {
    type: 'ADD_TOAST',
    payload: {
      id,
      kind,
      message,
      action,
    },
  };
};

const removeToast = (id: number) => {
  return { type: 'REMOVE_TOAST', id };
};

let nextToastId = 0;
export const addToastWithTimeout = (
  kind: Toasts,
  message: string,
  action?: Action
) => dispatch => {
  const id = nextToastId++;
  dispatch(addToast(id, kind, message));

  setTimeout(() => {
    dispatch(removeToast(id));
  }, kind === 'success' ? 2000 : 4000);
};
