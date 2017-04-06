import { getCommunity } from '../db/communities';
import { getAllStories } from '../db/stories';
import { getNotifications } from '../db/notifications';
import { track } from '../EventTracker';

export const setActiveCommunity = slug => (dispatch, getState) => {
  const { communities: { communities }, user: { uid } } = getState();

  const lowerCaseSlug = slug.toLowerCase();
  dispatch({
    type: 'SET_ACTIVE_COMMUNITY',
    slug: lowerCaseSlug,
  });

  if (
    lowerCaseSlug !== 'notifications' &&
    lowerCaseSlug !== 'everything' &&
    lowerCaseSlug !== 'explore' &&
    !communities.find(community => community.slug === lowerCaseSlug)
  ) {
    getCommunity({ slug: lowerCaseSlug }).then(community => {
      dispatch({
        type: 'ADD_COMMUNITY',
        community,
      });
    });
    return;
  }

  // Notifications
  if (lowerCaseSlug === 'notifications') {
    if (!uid) return;
    track('notifications', 'viewed', null);
    getNotifications(uid).then(notifications => {
      dispatch({
        type: 'SET_NOTIFICATIONS',
        notifications,
      });
    });
    return;
  }

  // Notifications
  if (lowerCaseSlug === 'explore') {
    if (!uid) return;
    track('explore', 'viewed', null);
    return;
  }

  // Everything
  if (lowerCaseSlug === 'everything') {
    // If there's no UID yet we might need to show the homepage, so don't do anything
    if (!uid) return;
    track('everything', 'viewed', null);
    // Get all the stories from all the frequencies
    getAllStories(uid)
      .then(stories => {
        dispatch({
          type: 'ADD_STORIES',
          stories,
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'STOP_LOADING' });
      });
    return;
  }
  // explore
  if (lowerCaseSlug === 'explore') {
    track('explore', 'viewed', null);
    return;
  }
};
