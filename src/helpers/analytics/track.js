// @flow

const amplitude = window.amplitude;

export const track = (eventType: string, eventProperties?: Object = {}) => {
  const amplitudePromise = () => {
    console.warn(`[Amplitude] Tracking ${eventType}`);
    return amplitude.getInstance().logEvent(eventType, {
      ...eventProperties,
      client: 'web',
    });
  };

  return Promise.all([amplitudePromise()]);
};
