// @flow

const amplitude = window.amplitude;

export const setUser = (userId: string) => {
  if (!amplitude) {
    console.warn('No amplitude function attached to window');
    return;
  }

  const AMPLITUDE_API_KEY =
    process.env.NODE_ENV === 'production'
      ? process.env.AMPLITUDE_API_KEY
      : process.env.AMPLITUDE_API_KEY_DEVELOPMENT;

  if (!AMPLITUDE_API_KEY) {
    // console.warn(`[Amplitude Dev] Set user ${userId}`);
    return;
  }

  const amplitudePromise = () => {
    // console.warn(`[Amplitude] Set user ${userId}`);
    return amplitude.getInstance().setUserId(userId);
  };

  return Promise.all([amplitudePromise()]);
};
