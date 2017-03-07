const initialState = {
  notifications: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        notifications: action.notifications,
      };
    default:
      return state;
  }
};
