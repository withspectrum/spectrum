// @flow

const amplitude = window.amplitude;

export const setUser = (userId: string) => {
  const amplitudePromise = () => {
    console.warn(`[Amplitude] Set user ${userId}`);
    return amplitude.getInstance().setUserId(userId);
  };

  return Promise.all([amplitudePromise()]);
};
