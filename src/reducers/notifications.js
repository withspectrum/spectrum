import { groupNotifications } from '../helpers/notifications';

const initialState = {
  // The grouped notification data, as grouped by the helper
  notifications: [],
  // The raw notifications as an array as they come from the database
  // need those to group new notifications as they come in
  raw: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const raw = state.raw
        .filter(notification => notification.id !== action.notification.id)
        .concat(action.notification);
      return {
        notifications: groupNotifications(raw),
        raw,
      };
    }
    case 'SET_NOTIFICATIONS': {
      return {
        notifications: groupNotifications(action.notifications),
        raw: action.notifications,
      };
    }
    default:
      return state;
  }
};
