import { getCommunity } from '../db/communities';

export const setActiveCommunity = slug => (dispatch, getState) => {
  const { communities: { communities } } = getState();

  if (!communities.find(community => community.slug === slug)) {
    getCommunity({ slug }).then(community => {
      dispatch({
        type: 'SET_ACTIVE_COMMUNITY',
        slug,
        community,
      });
    });
  } else {
    dispatch({
      type: 'SET_ACTIVE_COMMUNITY',
      slug,
    });
  }
};
