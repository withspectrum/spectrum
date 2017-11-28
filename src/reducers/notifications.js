const initialState = {
  directMessageNotifications: 0,
  notifications: 0,
};

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_NOTIFICATIONS_BADGE_COUNT': {
      const obj = Object.assign({}, state);
      obj[action.countType] = action.count;
      return obj;
    }
    default:
      return state;
  }
}
