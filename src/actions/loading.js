export const loading = () => ({
  type: 'LOADING',
});

export const stopLoading = () => ({
  type: 'STOP_LOADING',
});

export const setInitialData = (user, frequency, story) => ({
  type: 'SET_INITIAL_DATA',
  user,
  frequency,
  story,
});
