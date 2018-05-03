import Raven from 'raven-js';
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN_CLIENT) {
  Raven.config(process.env.SENTRY_DSN_CLIENT, {
    whitelistUrls: [/spectrum\.chat/, /www\.spectrum\.chat/],
    environment: process.env.NODE_ENV,
  }).install();
} else {
  console.error('Raven not enabled locally');
}

const ga = window.ga;

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
    console.warn('tracking: ', category, action, label);
  } else {
    if (!ga) return;
    // only send events from production
    try {
      ga('send', 'event', category, action, label);
    } catch (err) {
      console.error('error logging event', err);
    }
  }
};
