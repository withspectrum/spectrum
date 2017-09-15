// @flow
export const addCommunityToOnboarding = (community: Object) => {
  return {
    type: 'ADD_COMMUNITY_TO_NEW_USER_ONBOARDING',
    payload: community,
  };
};
