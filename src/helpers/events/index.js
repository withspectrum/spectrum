// @flow

import Raven from 'raven-js';
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN_CLIENT) {
  Raven.config(process.env.SENTRY_DSN_CLIENT, {
    whitelistUrls: [/spectrum\.chat/, /www\.spectrum\.chat/],
    environment: process.env.NODE_ENV,
  }).install();
} else {
  console.error('Raven not enabled locally');
}

const amplitude = window.amplitude;

export const track = (eventType: string, eventProperties?: Object = {}) => {
  const amplitudePromise = () => {
    console.warn(`[Amplitude] Tracking ${eventType}`);
    return amplitude.getInstance().logEvent(eventType, eventProperties);
  };

  return Promise.all([amplitudePromise()]);
};

export const setUser = (userId: string) => {
  const amplitudePromise = () => {
    console.warn(`[Amplitude] Set user ${userId}`);
    return amplitude.getInstance().setUserId(userId);
  };

  return Promise.all([amplitudePromise()]);
};

export const unsetUser = () => {
  const amplitudePromise = () => {
    console.warn('[Amplitude] Unset user');
    return amplitude.getInstance().setUserId(null);
  };

  return Promise.all([amplitudePromise()]);
};
