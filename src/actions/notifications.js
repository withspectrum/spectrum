import { markStoryRead } from '../db/notifications';
import { logException } from '../helpers/utils';

export const addNotification = notification => (dispatch, getState) => {
  const { stories: { active }, user: { uid } } = getState();
  if (notification.ids.story === active) {
    markStoryRead(active, uid)
      .then(() => {
        dispatch({
          type: 'ADD_NOTIFICATION',
          notification,
        });
      })
      .catch(err => {
        logException(err);
      });
  } else {
    dispatch({
      type: 'ADD_NOTIFICATION',
      notification,
    });
  }
};
