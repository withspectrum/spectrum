import Raven from 'raven-js';
Raven.config('https://3bd8523edd5d43d7998f9b85562d6924@sentry.io/154812', {
  whitelistUrls: [/spectrum\.chat/, /www\.spectrum\.chat/],
}).install();

const ga = window.ga;

export const set = id => {
  /**
	*
	* This get sets on login or on authentication. This helps us track the UID in GA
	* which will allow for us to have more meaningful understanding of future experiments
	*
	*/

  try {
    ga('set', 'userId', id); // Set the user ID using signed-in user_id.
  } catch (err) {
    console.log(err);
  }
};

export const track = (category, action, label) => {
  /**
  *
  *	Category: the object interacted with (user, channel, thread, message, etc)
  * Action: the type of interaction (sign out, joined channel, published thread, sent message, etc)
  * Label: used to organize events (experiment variant A vs B)

  * Style guide:
  * * lowercase
  * * spaces between words
  * * past-tense (i.e. created vs create, signed out vs sign out)
  * * action should attempt to be past tense of the function it is called in, for clarity
  * * * e.g. closeModal() => track('modal', 'closed', null)
  * * * e.g. sendMessage() => track('message', 'sent', null)

	* Some examples:
	* track('user', 'signed out') => User category, sign out action
	* track('channel', 'created') => Channel category, created action
	* track('thread', 'deleted') => Thread category, deleted action

  */

  // console log tracking events locally so that we can quickly make sure things are firing properly
  if (process.env.NODE_ENV !== 'production') {
    console.log('tracking: ', category, action, label);
  } else {
    // only send events from production
    try {
      ga('send', 'event', category, action, label);
    } catch (err) {
      console.log(err);
    }
  }
};

export const crashReporter = store => next => action => {
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
