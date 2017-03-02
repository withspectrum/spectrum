export const saveStorage = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // errors here
  }
};

export const loadStorage = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    // Empty the saved state since something went wrong with the data
    saveStorage({});
    return undefined;
  }
};

export const clearStorage = () => {
  localStorage.removeItem('state');
};
