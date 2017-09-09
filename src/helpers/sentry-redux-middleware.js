import Raven from 'raven-js';

const crashReporter = store => next => action => {
  // Handle THROW_ERROR actions
  if (action.type === 'THROW_ERROR') {
    console.error('Caught an exception!', action.err);
    if (process.env.NODE_ENV !== 'development') {
      Raven.captureException(action.err, {
        extra: {
          action,
          state: store.getState(),
        },
      });
    }
  }

  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    if (process.env.NODE_ENV !== 'development') {
      Raven.captureException(err, {
        extra: {
          action,
          state: store.getState(),
        },
      });
    }
    throw err;
  }
};

export default crashReporter;
