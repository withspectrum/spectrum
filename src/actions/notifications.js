import { markStoryRead } from '../db/notifications';

export const addNotification = notification => (dispatch, getState) => {
  const { stories: { active }, user: { uid } } = getState();
  if (notification.ids.story === active) {
    markStoryRead(active, uid).then(() => {
      dispatch(addNotification(notification));
    });
  } else {
    dispatch(addNotification(notification));
  }
};
