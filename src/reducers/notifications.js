import { groupNotifications } from '../helpers/notifications';

const initialState = {
  notifications: [],
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
