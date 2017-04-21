const initialState = {
  communities: [],
  active: null,
};

export default function communities(state = initialState, action) {
  switch (action.type) {
    case 'ADD_COMMUNITY':
      if (
        state.communities.find(
          community => community.id === action.community.id
        )
      )
        return state;
      return {
        ...state,
        communities: state.communities.concat([action.community]),
      };
    case 'SET_COMMUNITIES':
      return {
        ...state,
        communities: action.communities,
      };
    case 'SET_ACTIVE_COMMUNITY':
      let communities = state.communities;
      if (
        action.community &&
        !state.communities.find(
          community => community.id === action.community.id
        )
      ) {
        communities.push(action.community);
      }
      return {
        ...state,
        active: action.slug,
        communities,
      };
    default:
      return state;
  }
}
