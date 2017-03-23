const initialState = {
  communities: [],
  active: null,
};

export default function communities(state = initialState, action) {
  switch (action.type) {
    case 'ADD_COMMUNITY':
      if (
        state.communities.find(
          community => community.id === action.community.id,
        )
      )
        return state;
      return {
        communities: state.communities.concat([action.community]),
      };
    case 'SET_COMMUNITIES':
      return {
        communities: action.communities,
      };
    case 'SET_ACTIVE_COMMUNITY':
      let communities = state.communities;
      if (action.community) {
        communities.push(action.community);
      }
      return {
        active: action.slug,
        communities,
      };
    default:
      return state;
  }
}
