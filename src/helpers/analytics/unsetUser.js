// @flow

const amplitude = window.amplitude;

export const unsetUser = () => {
  const amplitudePromise = () => {
    console.warn('[Amplitude] Unset user');
    return amplitude.getInstance().setUserId(null);
  };

  return Promise.all([amplitudePromise()]);
};
