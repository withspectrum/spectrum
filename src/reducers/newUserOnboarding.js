const initialState = {
  community: null,
};

export default function newUserOnboarding(state = initialState, action) {
  switch (action.type) {
    case 'ADD_COMMUNITY_TO_NEW_USER_ONBOARDING':
      return Object.assign({}, state, {
        community: { ...action.payload },
      });
    default:
      return state;
  }
}
